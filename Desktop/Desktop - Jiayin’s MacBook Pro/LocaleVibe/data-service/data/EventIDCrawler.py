import sys
import json
from bs4 import BeautifulSoup
import asyncio
import aiohttp

# Read arguments from the command line input.
pages = sys.argv[1]
date = sys.argv[2]
state = sys.argv[3]
city = sys.argv[4]

# Format the geographical string based on state and city
if city and city.lower() != 'null':
    geo = f"{state}--{city.replace(' ', '-')}"
else:
    geo = f"united-states--{state}"

# Create URLs for all pages
base_url = f"https://www.eventbrite.com/d/{geo}/all-events/"
urls = [f"{base_url}?end_date={date}&start_date={date}&page={i}" for i in range(1, int(pages) + 1)]

# A set to store unique event IDs
events = set()

async def fetch(session, url):
    try:
        async with session.get(url) as response:
            if response.status == 200:
                soup = BeautifulSoup(await response.text(), 'html.parser')
                results = soup.find_all("a", {"class": "event-card-link"})
                for result in results:
                    events.add(result['data-event-id'])
            else:
                sys.stderr.write(f"Error fetching {url}: {response.status}\n")
    except Exception as e:
        sys.stderr.write(f"Exception occurred while fetching {url}: {e}\n")

async def main():
    # Disable SSL verification to avoid SSL related issues
    connector = aiohttp.TCPConnector(ssl=False)
    async with aiohttp.ClientSession(connector=connector) as session:
        await asyncio.gather(*(fetch(session, url) for url in urls))

    # Write the list of event IDs or an empty list to stdout as JSON
    sys.stdout.write(json.dumps(list(events)))

# Run the main function using asyncio
asyncio.run(main())
