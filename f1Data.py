import fastf1
import pandas as pd

session = fastf1.get_session(2026, 1, 'Qualifying')
session.load()
session.results

# session.results.info()

# print(session.results)
print(session.results.columns)


pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)

print(session.results)

