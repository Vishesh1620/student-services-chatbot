import boto3

cognito = boto3.client('cognito-idp', region_name='us-east-1')

USER_POOL_ID = 'us-east-1_DRBfrBbTg'

students = [
    {"name": "Alice Johnson", "email": "alice.johnson@school.edu", "student_id": "S1001"},
    {"name": "Brian Smith", "email": "brian.smith@school.edu", "student_id": "S1002"},
    {"name": "Carla Lee", "email": "carla.lee@school.edu", "student_id": "S1003"},
    {"name": "David Chen", "email": "david.chen@school.edu", "student_id": "S1004"},
    {"name": "Emma Davis", "email": "emma.davis@school.edu", "student_id": "S1005"},
    {"name": "Frank Wilson", "email": "frank.wilson@school.edu", "student_id": "S1006"},
    {"name": "Grace Martinez", "email": "grace.martinez@school.edu", "student_id": "S1007"},
    {"name": "Henry Taylor", "email": "henry.taylor@school.edu", "student_id": "S1008"},
    {"name": "Iris Anderson", "email": "iris.anderson@school.edu", "student_id": "S1009"},
    {"name": "Jack Thomas", "email": "jack.thomas@school.edu", "student_id": "S1010"}
]

for student in students:
    try:
        # Create user
        cognito.admin_create_user(
            UserPoolId=USER_POOL_ID,
            Username=student['email'],
            UserAttributes=[
                {'Name': 'email', 'Value': student['email']},
                {'Name': 'email_verified', 'Value': 'true'},
                {'Name': 'name', 'Value': student['name']},
                {'Name': 'custom:student_id', 'Value': student['student_id']}
            ],
            TemporaryPassword='TempPass123!',
            MessageAction='SUPPRESS'
        )
        
        # Set permanent password
        cognito.admin_set_user_password(
            UserPoolId=USER_POOL_ID,
            Username=student['email'],
            Password='Test123!',
            Permanent=True
        )
        
        print(f"[OK] Created: {student['name']} - {student['email']}")
        
    except cognito.exceptions.UsernameExistsException:
        print(f"[WARN] User already exists: {student['email']}")
    except Exception as e:
        print(f"[ERROR] Error creating {student['email']}: {e}")

print("\n[DONE] All users can log in with password: Test123!")