import motor.motor_asyncio
import asyncio

async def connect():
    # Use your MongoDB connection string
    client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017/")
    
    
    db = client.crop  # Use quotes around the database name
    try:
        # Ping the database to check the connection
        await db.command('ping')  
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print("Error connecting to MongoDB:", e)
    finally:
        client.close()  # Close the client

loop = asyncio.get_event_loop()
loop.run_until_complete(connect())
