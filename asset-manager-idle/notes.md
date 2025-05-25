Before coding again, I want to do some planning for future phases.
To start I think phase 1 was a success, I expecially like the bloomberg asthetic.

## Phase 2 Enhancements
### Technical requirements
- Add the ability to persist game state and player progress. Currently everything resets between browser refreshes.
- Try splitting up the web app into seperate files for css, html and javascript.
- Create clearly defined object classes for the asset types (ex: US Treasury 10Y) included the game in the javascript code. I would like the attributes and behaviour to be clearly documented so that they can be easily inspected in a code review. Make sure to use proper object oriented programming for this such as inheritance.

### Game Features
- Create a time system, I want the player to experience economic cycles. lets try a time system of 24 hours and 365 days in a year. lets try: 1 real world second equals 1 hour in the game time system. Lets also assume markets trade at all hours of the day for now, however consider that this may be modified in the future. I would also like to ensure users portfolios will be updated when bond interests are due.
- Modify the asset objects to account for this time system.
- Corporate Bonds Expansion - Adding investment-grade and high-yield corporate bonds
- I would like there to be a portfolio analytics tab. For now lets just have a simple but elegant chart showing the users portfolio value over time.
- Some Advanced UI Features such as interactive charts for interest rates and economic indicators.
- Add a new Asset class for Corporate Bonds.


## Phase 3 Enhancements
### Technical Requirements
- Ensure the ability of the user to save their game between sessions.

### Game Features
- Advanced UI Features - Interactive charts, portfolio analytics
- Additional Asset Classes - Stocks, derivatives, commodities
- Educational System - Tooltips, tutorials, and help guides
- Advanced Analytics - Risk metrics, correlation analysis
- Performance Optimization - For handling larger portfolios

## Possibly Phase 4?
### Game Features
- Create game scenarios. Such as the user is a pension fund, and has to manage market volatility, while taking on new deposites and making pension payments. The user is a hedge fund. The User is a Bank.