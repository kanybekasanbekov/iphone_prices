import argparse
import os
import ast
import json
import pandas as pd
import instaloader
from openai import OpenAI
from datetime import datetime

# Danger! This is my secret key.
client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
)

# load main prompt from file
with open('prompt.txt', 'r') as f:
    MAIN_PROMT = f.read()

# load database from file
with open('database.json', 'r') as f:
    DATABASE = json.load(f)


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--username', type=str, default='', help='Instagram username')
    parser.add_argument('--password', type=str, default='', help='Instagram password')
    return parser.parse_args()

if __name__ == "__main__":
    args = get_args()
    login = args.username
    password = args.password

    bot = instaloader.Instaloader()
    if login and password:
        bot.login(login, password)
        print(f'Logged in to account {login} successfully.')

    usernames = ['telefonchik009', 'mobillion.kg', 'apple.tsum', 'apple__kg']
    for usrnme in usernames:
        try:
            profile = instaloader.Profile.from_username(bot.context, usrnme)
        except instaloader.exceptions.ProfileNotExistsException:
            print('Either profile does not exist or is private.')
            if not login or not password:
                print('Please provide username, password and login to your account.')
            print(f'Skipping {usrnme} ...')
            continue

        print()
        print("Username: ", profile.username)
        print("User ID: ", profile.userid)
        print("Number of Posts: ", profile.mediacount)

        i = 0
        for post in profile.get_posts():
            i += 1

            # get media id
            mediaid = post.mediaid

            # check if media id is already in database
            if mediaid in DATABASE:
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
                print('WARNING: Could not convert to dictionary.')
                is_valid_res = False
                res = {}
        
            # check if dictionary is empty
            if len(res) == 0:
                print('WARNING: Dictionary is empty.')
                is_valid_res = False

            if is_valid_res:
                # add more data to dictionary
                res['link'] = 'https://www.instagram.com/p/' + post.shortcode
                res['date'] = post.date.strftime("%Y/%m/%d")
                res['mediaid'] = mediaid

            # add to database
            DATABASE[mediaid] = res
            
            # save json
            with open('database.json', 'w') as f:
                json.dump(DATABASE, f, indent=4)

            if i >= 5:
                break
            # break