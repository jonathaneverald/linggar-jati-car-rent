from sqlalchemy import create_engine
from config.config import Config

print("Connecting to MySQL Database")
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
connection = engine.connect()
print("Success connecting to MySQL Database")
