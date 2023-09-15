from requests_html import HTMLSession
# import asyncio
# import selenium

provinces = {
1:"Alberta", 3:"British Columbia",
8:"Manitoba", 6:"New Brunswick", 
10:"Newfoundland", 11:"Northwest Territories",
5:"Nova Scotia",9:"Nunavut", 20:"Ontario",
12:"Prince Edward Island", 4:"Quebec",
7:"Saskatchewan", 13:"Yukon"}

link = "https://www.realtor.ca/office-search-results#province=1&page=1&sort=8-A"

def main(session):
    res = session.get(link)
    res.html.render(sleep=10, reload=False)
    
    print(res.html.html)
    for h in res.html:
        print(h)
    # print(res.html.html)

    

if __name__ == "__main__":
    session = HTMLSession()
    main(session)
