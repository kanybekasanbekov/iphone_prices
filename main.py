import argparse
import os
import ast
import json
import pandas as pd
import instaloader
from openai import OpenAI
from datetime import datetime, timedelta

# Danger! This is my secret key.
client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
)

ONLINE_STORES = ['telefonchik009', 'mobillion.kg', 'apple.tsum', 'apple__kg', \
                    'crazy.store.kg', 'sotochka312', 'nur_store_kg']


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--login', type=str, default='', help='Instagram login')
    parser.add_argument('--password', type=str, default='', help='Instagram password')
    parser.add_argument('--days', type=int, default=30, help='Number of days to scrape')
    parser.add_argument('--samsung', action='store_true', help='Scrape Samsung')
    return parser.parse_args()

if __name__ == "__main__":
    args = get_args()
    login = args.login
    password = args.password
    days = args.days
    samsung = args.samsung

    suffix = ''
    if samsung:
        suffix = '_samsung'

    # load main prompt from file
    with open(f'prompt{suffix}.txt', 'r') as f:
        MAIN_PROMT = f.read()

    # load database from file
    with open(f'database{suffix}.json', 'r') as f:
        DATABASE = json.load(f)

    today_date = datetime.now()
    one_month_ago = today_date - timedelta(days=days)

    bot = instaloader.Instaloader()
    if login and password:
        bot.login(login, password)
        print(f'Logged in to account {login} successfully.')

    for usrnme in ONLINE_STORES:
        try:
            profile = instaloader.Profile.from_username(bot.context, usrnme)
        except Exception as e:
            print(e)
            print(f'Skipping {usrnme} ... \n')
            continue

        print("Starting to scrape ", usrnme)

        for post in profile.get_posts():
            # check if post is recent
            if post.date < one_month_ago:
                break

            # get media id
            mediaid = post.mediaid

            # print info
            print(f'INFO: Processing post {mediaid}')

            # check if media id is already in database
            if str(mediaid) in DATABASE:
                print(f'INFO: This post is already in database. {mediaid}')
                continue

            # check if post has caption
            if not post.caption:
                print(f'INFO: This post has no caption. {mediaid}')
                continue

            # send request to openai
            response = client.chat.completions.create(
                model="gpt-3.5-turbo-1106",
                response_format={ "type": "json_object" },
                messages=[
                    {"role": "system", "content": MAIN_PROMT},
                    {"role": "user", "content": post.caption}
                ]
            )

            # get response as a text
            res = response.choices[0].message.content

            # convert text to dictionary
            is_valid_res = True
            try:
                res = ast.literal_eval(res)
            except Exception as e:
                print(f'WARNING: Could not convert to dictionary. {mediaid}')
                is_valid_res = False
                res = {}
        
            # check if dictionary is empty
            if len(res) == 0:
                print(f'WARNING: Dictionary is empty. {mediaid}')
                is_valid_res = False

            # add more data to dictionary
            res['link'] = 'https://www.instagram.com/p/' + post.shortcode
            res['date'] = post.date.strftime("%Y/%m/%d")

            # add to database
            DATABASE[mediaid] = res
            
            # save json
            with open('database.json', 'w') as f:
                json.dump(DATABASE, f, indent=4)

        print(f'Finished {usrnme} ...\n')
    
    # delete outdated from database
    for key, value in DATABASE.copy().items():
        date = datetime.strptime(value['date'], "%Y/%m/%d")
        if date < one_month_ago:
            print(f'INFO: Deleting outdated post from database. {key}')
            del DATABASE[key]
    
    # save json
    with open('database.json', 'w') as f:
        json.dump(DATABASE, f, indent=4)