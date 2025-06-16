from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    signup_date = Column(DateTime)

class Transaction(Base):
    __tablename__ = 'transactions'
    txn_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    amount = Column(Float)
    currency = Column(String)
    category = Column(String)
    merchant = Column(String)
    timestamp = Column(DateTime)

class Refund(Base):
    __tablename__ = 'refunds'
    refund_id = Column(Integer, primary_key=True)
    txn_id = Column(Integer, ForeignKey('transactions.txn_id'))
    amount = Column(Float)
    timestamp = Column(DateTime)

class Subscription(Base):
    __tablename__ = 'subscriptions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    plan = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime, nullable=True)
    auto_renew = Column(Boolean)
