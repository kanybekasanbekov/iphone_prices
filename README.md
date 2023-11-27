# Instagram iPhone Price Scraper
The repository allows to fetch iPhone prices and related information (model, capacity, battery health, etc.) from specific Instagram profiles selling iPhones. It interacts with Instagram posts, extracts relevant details from the captions, and then uses OpenAI's GPT-3 model to process this information.

## Requirements
* Instaloader: scrape Instagram posts
* OpenAI API: process captions
* Pandas: manipulate data

## Pre-requisites
* Create an OpenAI account, get an API key and set environment variable([help](https://www.immersivelimit.com/tutorials/adding-your-openai-api-key-to-system-environment-variables)).
* Create an Instagram account or use your existing one.

## Usage
Scrape Instagram posts, process them and save to JSON file:
```
python main.py
```
Build pretty markdown table from JSON file:
```
python build_table.py
```

## TODO
* Sort phones by date
* Keep track of phones within 3 months