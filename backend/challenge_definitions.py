challenges = [
    {
        "id": 1,
        "title": "Select All Users",
        "prompt": "Retrieve all columns for every user in the users table.",
        "difficulty": "BASIC",
        "solution_sql": """
            SELECT * FROM users
        """,
        "expected_columns": ["user_id", "name", "email", "signup_date"],
        "hints": [
            "Use SELECT * to get all columns.",
            "The FROM clause specifies the table."
        ],
        "example_data": {
            "users": [
                {"user_id": 1, "name": "Alice"},
                {"user_id": 2, "name": "Bob"}
            ]
        }
    },
    {
        "id": 2,
        "title": "List All Transactions",
        "prompt": "Show all transactions with their amounts.",
        "difficulty": "BASIC",
        "solution_sql": """
            SELECT txn_id, amount FROM transactions
        """,
        "expected_columns": ["txn_id", "amount"],
        "hints": [
            "Select specific columns from the transactions table."
        ],
        "example_data": {
            "transactions": [
                {"txn_id": 1001, "amount": 50.0},
                {"txn_id": 1002, "amount": 20.5}
            ]
        }
    },
    {
        "id": 3,
        "title": "Find Unique Merchants",
        "prompt": "List all unique merchants from the transactions table.",
        "difficulty": "BASIC",
        "solution_sql": """
            SELECT DISTINCT merchant FROM transactions
        """,
        "expected_columns": ["merchant"],
        "hints": [
            "Use DISTINCT to get unique values."
        ],
        "example_data": {
            "transactions": [
                {"txn_id": 1001, "merchant": "Amazon"},
                {"txn_id": 1002, "merchant": "eBay"},
                {"txn_id": 1003, "merchant": "Amazon"}
            ]
        }
    },
    {
        "id": 4,
        "title": "Top Merchants by Spend",
        "prompt": "Show the top 5 merchants by total transaction amount.",
        "difficulty": "EASY",
        "solution_sql": """
            SELECT merchant, ROUND(SUM(amount), 2) AS total_spent
            FROM transactions
            GROUP BY merchant
            ORDER BY total_spent DESC
            LIMIT 5
        """,
        "expected_columns": ["merchant", "total_spent"],
        "hints": [
            "Use SUM to calculate total spend per merchant.",
            "ORDER BY the sum in descending order and LIMIT the results."
        ],
        "example_data": {
            "transactions": [
                {"txn_id": 1001, "merchant": "Amazon", "amount": 100.0},
                {"txn_id": 1002, "merchant": "eBay", "amount": 50.0},
                {"txn_id": 1003, "merchant": "Amazon", "amount": 75.0}
            ]
        }
    },
    {
        "id": 5,
        "title": "Users with No Subscriptions",
        "prompt": "List all users who don't have any active subscription.",
        "difficulty": "EASY",
        "solution_sql": """
            SELECT u.user_id, u.name
            FROM users u
            LEFT JOIN subscriptions s ON u.user_id = s.user_id
            WHERE s.user_id IS NULL
        """,
        "expected_columns": ["user_id", "name"],
        "hints": [
            "Use LEFT JOIN to include all users.",
            "Check for NULL in the joined table to find users without subscriptions."
        ],
        "example_data": {
            "users": [
                {"user_id": 1, "name": "Alice"},
                {"user_id": 2, "name": "Bob"}
            ],
            "subscriptions": [
                {"subscription_id": 1, "user_id": 1, "start_date": "2024-01-01", "end_date": "2024-06-01"}
            ]
        }
    },
    {
        "id": 6,
        "title": "Most Refunded Merchant",
        "prompt": "Which merchant has the highest number of refunds?",
        "difficulty": "EASY",
        "solution_sql": """
            SELECT t.merchant, COUNT(*) AS refund_count
            FROM refunds r
            JOIN transactions t ON r.txn_id = t.txn_id
            GROUP BY t.merchant
            ORDER BY refund_count DESC
            LIMIT 1
        """,
        "expected_columns": ["merchant", "refund_count"],
        "hints": [
            "Join refunds with transactions to get merchant info.",
            "Order by refund count and limit to the top result."
        ],
        "example_data": {
            "transactions": [
                {"txn_id": 1001, "merchant": "Amazon"},
                {"txn_id": 1002, "merchant": "eBay"},
                {"txn_id": 1003, "merchant": "Amazon"}
            ],
            "refunds": [
                {"refund_id": 1, "txn_id": 1001},
                {"refund_id": 2, "txn_id": 1003}
            ]
        }
    },
    {
        "id": 7,
        "title": "Highest Single Transaction",
        "prompt": "Find the user who made the highest single transaction and the amount.",
        "difficulty": "EASY",
        "solution_sql": """
            SELECT user_id, amount
            FROM transactions
            ORDER BY amount DESC
            LIMIT 1
        """,
        "expected_columns": ["user_id", "amount"],
        "hints": [
            "Order transactions by amount descending.",
            "Limit to the top result to get the highest transaction."
        ],
        "example_data": {
            "transactions": [
                {"txn_id": 1001, "user_id": 1, "amount": 100.0},
                {"txn_id": 1002, "user_id": 2, "amount": 150.0}
            ]
        }
    },
    {
        "id": 8,
        "title": "Suspicious Refunds",
        "prompt": "Find users who received more than 2 refunds in a single month.",
        "difficulty": "MEDIUM",
        "solution_sql": """
            SELECT u.user_id, strftime('%Y-%m', r.timestamp) AS refund_month, COUNT(*) AS refund_count
            FROM users u
            JOIN transactions t ON u.user_id = t.user_id
            JOIN refunds r ON t.txn_id = r.txn_id
            GROUP BY u.user_id, refund_month
            HAVING COUNT(*) > 2
        """,
        "expected_columns": ["user_id", "refund_month", "refund_count"],
        "hints": [
            "Use GROUP BY to aggregate refunds by user and month.",
            "COUNT the number of refunds and filter with HAVING."
        ],
        "example_data": {
            "users": [
                {"user_id": 1, "name": "Alice"}
            ],
            "transactions": [
                {"txn_id": 1001, "user_id": 1},
                {"txn_id": 1002, "user_id": 1},
                {"txn_id": 1003, "user_id": 1}
            ],
            "refunds": [
                {"refund_id": 1, "txn_id": 1001, "timestamp": "2024-08-01"},
                {"refund_id": 2, "txn_id": 1002, "timestamp": "2024-08-03"},
                {"refund_id": 3, "txn_id": 1003, "timestamp": "2024-08-15"}
            ]
        }
    },
    {
        "id": 9,
        "title": "Currency Diversity",
        "prompt": "Find users who transacted in more than 2 different currencies.",
        "difficulty": "MEDIUM",
        "solution_sql": """
            SELECT user_id, COUNT(DISTINCT currency) AS currency_count
            FROM transactions
            GROUP BY user_id
            HAVING currency_count > 2
        """,
        "expected_columns": ["user_id", "currency_count"],
        "hints": [
            "COUNT DISTINCT currencies per user.",
            "Use HAVING to filter users with more than 2 currencies."
        ],
        "example_data": {
            "transactions": [
                {"txn_id": 1001, "user_id": 1, "currency": "USD"},
                {"txn_id": 1002, "user_id": 1, "currency": "EUR"},
                {"txn_id": 1003, "user_id": 1, "currency": "GBP"},
                {"txn_id": 1004, "user_id": 2, "currency": "USD"}
            ]
        }
    },
    {
        "id": 10,
        "title": "Inactive Users",
        "prompt": "Find users who have not made any transactions in the last 6 months.",
        "difficulty": "MEDIUM",
        "solution_sql": """
            SELECT u.user_id, u.name
            FROM users u
            LEFT JOIN transactions t ON u.user_id = t.user_id AND t.timestamp >= date('now', '-6 months')
            WHERE t.txn_id IS NULL
        """,
        "expected_columns": ["user_id", "name"],
        "hints": [
            "LEFT JOIN users with transactions in the last 6 months.",
            "Filter where transaction is NULL to find inactive users."
        ],
        "example_data": {
            "users": [
                {"user_id": 1, "name": "Alice"},
                {"user_id": 2, "name": "Bob"}
            ],
            "transactions": [
                {"txn_id": 1001, "user_id": 1, "timestamp": "2023-01-01"}
            ]
        }
    },
    {
        "id": 11,
        "title": "Monthly Growth in Transactions",
        "prompt": "Show the number of transactions per month for the last 12 months.",
        "difficulty": "MEDIUM",
        "solution_sql": """
            SELECT strftime('%Y-%m', timestamp) AS month, COUNT(*) AS txn_count
            FROM transactions
            WHERE timestamp >= date('now', '-12 months')
            GROUP BY month
            ORDER BY month
        """,
        "expected_columns": ["month", "txn_count"],
        "hints": [
            "Use strftime to extract year and month.",
            "Filter transactions from the last 12 months."
        ],
        "example_data": {
            "transactions": [
                {"txn_id": 1001, "timestamp": "2024-01-15"},
                {"txn_id": 1002, "timestamp": "2024-01-20"},
                {"txn_id": 1003, "timestamp": "2024-02-10"}
            ]
        }
    },
    {
        "id": 12,
        "title": "Average Subscription Duration",
        "prompt": "Calculate the average duration (in days) of all subscriptions.",
        "difficulty": "MEDIUM",
        "solution_sql": """
            SELECT ROUND(AVG(julianday(end_date) - julianday(start_date)), 2) AS avg_duration_days
            FROM subscriptions
            WHERE end_date IS NOT NULL
        """,
        "expected_columns": ["avg_duration_days"],
        "hints": [
            "Use julianday to calculate date differences.",
            "Average the durations for all subscriptions."
        ],
        "example_data": {
            "subscriptions": [
                {"subscription_id": 1, "user_id": 1, "start_date": "2024-01-01", "end_date": "2024-02-01"},
                {"subscription_id": 2, "user_id": 2, "start_date": "2024-03-01", "end_date": "2024-04-01"}
            ]
        }
    },
    {
        "id": 13,
        "title": "Average Monthly Spend per User",
        "prompt": "Calculate the average monthly spending for each user.",
        "difficulty": "HARD",
        "solution_sql": """
            SELECT user_id,
                   ROUND(SUM(amount) / COUNT(DISTINCT strftime('%Y-%m', timestamp)), 2) AS avg_monthly_spend
            FROM transactions
            GROUP BY user_id
        """,
        "expected_columns": ["user_id", "avg_monthly_spend"],
        "hints": [
            "Use SUM to get total spend and COUNT DISTINCT months.",
            "Divide total spend by the number of months for the average."
        ],
        "example_data": {
            "transactions": [
                {"txn_id": 1001, "user_id": 1, "amount": 100.0, "timestamp": "2024-01-15"},
                {"txn_id": 1002, "user_id": 1, "amount": 50.0, "timestamp": "2024-02-10"},
                {"txn_id": 1003, "user_id": 2, "amount": 200.0, "timestamp": "2024-01-20"}
            ]
        }
    },
    {
        "id": 14,
        "title": "Users with Consecutive Refunds",
        "prompt": "Find users who received refunds on two consecutive days.",
        "difficulty": "HARD",
        "solution_sql": """
            SELECT DISTINCT r1.user_id
            FROM (
                SELECT t.user_id, date(r.timestamp) AS refund_date
                FROM refunds r
                JOIN transactions t ON r.txn_id = t.txn_id
            ) r1
            JOIN (
                SELECT t.user_id, date(r.timestamp) AS refund_date
                FROM refunds r
                JOIN transactions t ON r.txn_id = t.txn_id
            ) r2
            ON r1.user_id = r2.user_id AND r1.refund_date = date(r2.refund_date, '-1 day')
        """,
        "expected_columns": ["user_id"],
        "hints": [
            "Self-join refunds by user and date.",
            "Check if refund dates are consecutive using date arithmetic."
        ],
        "example_data": {
            "users": [
                {"user_id": 1, "name": "Alice"}
            ],
            "transactions": [
                {"txn_id": 1001, "user_id": 1},
                {"txn_id": 1002, "user_id": 1},
                {"txn_id": 1003, "user_id": 1}
            ],
            "refunds": [
                {"refund_id": 1, "txn_id": 1001, "timestamp": "2024-08-01"},
                {"refund_id": 2, "txn_id": 1002, "timestamp": "2024-08-02"},
                {"refund_id": 3, "txn_id": 1003, "timestamp": "2024-08-15"}
            ]
        }
    },
    {
        "id": 15,
        "title": "Users with All Refunds",
        "prompt": "List users who have had every one of their transactions refunded.",
        "difficulty": "HARD",
        "solution_sql": """
            SELECT u.user_id
            FROM users u
            JOIN transactions t ON u.user_id = t.user_id
            LEFT JOIN refunds r ON t.txn_id = r.txn_id
            GROUP BY u.user_id
            HAVING COUNT(t.txn_id) = COUNT(r.refund_id)
        """,
        "expected_columns": ["user_id"],
        "hints": [
            "Compare the count of transactions and refunds per user.",
            "Use HAVING to filter users where both counts match."
        ],
        "example_data": {
            "users": [
                {"user_id": 1, "name": "Alice"},
                {"user_id": 2, "name": "Bob"}
            ],
            "transactions": [
                {"txn_id": 1001, "user_id": 1},
                {"txn_id": 1002, "user_id": 1},
                {"txn_id": 1003, "user_id": 2}
            ],
            "refunds": [
                {"refund_id": 1, "txn_id": 1001},
                {"refund_id": 2, "txn_id": 1002}
            ]
        }
    }
]
