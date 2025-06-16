from faker import Faker
import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Transaction, Refund, Subscription

fake = Faker()
engine = create_engine("sqlite:///sqlgym.db")
Session = sessionmaker(bind=engine)
session = Session()

def seed():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    # Generate mock users
    users = []
    for _ in range(500):
        user = User(
            name=fake.name(),
            email=fake.email(),
            signup_date=fake.date_time_between(start_date='-2y', end_date='now')
        )
        users.append(user)
        session.add(user)
    session.commit()

    # For each user generate mock transactions (5-20)
    transactions = []
    for user in users:
        for _ in range(random.randint(5, 20)):
            txn = Transaction(
                user_id=user.user_id,
                amount=round(random.uniform(-100, 1000), 2),
                currency=random.choice(['USD', 'EUR', 'GBP']),
                category=random.choice(['groceries', 'entertainment', 'travel', 'utilities', 'subscriptions']),
                merchant=fake.company(),
                timestamp=fake.date_time_between(start_date=user.signup_date, end_date='now')
            )
            transactions.append(txn)
            session.add(txn)
    session.commit()

    # Refunds of transactions
    refunds = []
    for txn in random.sample(transactions, k=150):
        if random.random() < 0.3:
            refund = Refund(
                txn_id=txn.txn_id,
                amount=txn.amount * random.uniform(0.5, 1.0),
                timestamp=txn.timestamp + timedelta(days=random.randint(1, 30))
            )
            refunds.append(refund)
            session.add(refund)
    session.commit()

    # Some percentage of users have subscriptions
    for user in users:
        if random.random() < 0.7:
            sub = Subscription(
                user_id=user.user_id,
                plan=random.choice(['basic', 'premium', 'pro']),
                start_date=fake.date_time_between(start_date=user.signup_date, end_date='now'),
                end_date=None if random.random() < 0.5 else fake.future_date(end_date='+180d'),
                auto_renew=random.choice([True, False])
            )
            session.add(sub)
    session.commit()

if __name__ == "__main__":
    seed()
