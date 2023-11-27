import json
import pandas as pd

# Read the JSON file
with open('database.json', 'r') as file:
    data = json.load(file)

# Convert JSON to Pandas DataFrame
df = pd.DataFrame.from_dict(data, orient='index')

# Group data by 'model' and 'capacity' columns
grouped = df.groupby(['model', 'capacity'])

# Write markdown tables for each group to a single file
with open('iphone_prices.md', 'w') as output_file:
    for (model, capacity), group_data in grouped:
        # Create a section for each model and capacity combination
        markdown_table = f"## {model} {capacity}\n\n"

        # Create a copy of the group data to modify the 'link' column 
        # format without changing the original DataFrame
        group_data_formatted = group_data.copy()

        # Format 'link' column as Markdown links
        group_data_formatted['link'] = group_data_formatted['link'].apply(lambda x: f"[link]({x})")

        # Convert group data to markdown table without index column
        markdown_table += group_data_formatted.to_markdown(index=False) + "\n\n"
        output_file.write(markdown_table)
