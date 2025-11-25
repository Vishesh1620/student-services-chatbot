import boto3
from botocore.exceptions import ClientError
import uuid
from datetime import datetime
from decimal import Decimal  # ← Add this import

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

print("🗑️  Deleting existing tables (if any)...")

# Delete existing tables
for table_name in ["Students", "Courses", "Registrations"]:
    try:
        table = dynamodb.Table(table_name)
        table.delete()
        table.wait_until_not_exists()
        print(f"✅ Deleted: {table_name}")
    except ClientError as e:
        if "ResourceNotFoundException" in str(e):
            print(f"⚠️  {table_name} doesn't exist, skipping deletion")
        else:
            print(f"❌ Error deleting {table_name}: {e}")

print("\n🔨 Creating fresh tables...\n")

# ============================================
# 1. STUDENTS TABLE
# ============================================
try:
    students_table = dynamodb.create_table(
        TableName='Students',
        KeySchema=[
            {'AttributeName': 'student_id', 'KeyType': 'HASH'}
        ],
        AttributeDefinitions=[
            {'AttributeName': 'student_id', 'AttributeType': 'S'},
            {'AttributeName': 'email', 'AttributeType': 'S'}
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'email-index',
                'KeySchema': [{'AttributeName': 'email', 'KeyType': 'HASH'}],
                'Projection': {'ProjectionType': 'ALL'}
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    students_table.wait_until_exists()
    print("✅ Created: Students (with email GSI)")
except ClientError as e:
    print(f"❌ Error creating Students: {e}")

# ============================================
# 2. COURSES TABLE
# ============================================
try:
    courses_table = dynamodb.create_table(
        TableName='Courses',
        KeySchema=[
            {'AttributeName': 'course_id', 'KeyType': 'HASH'}
        ],
        AttributeDefinitions=[
            {'AttributeName': 'course_id', 'AttributeType': 'S'}
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    courses_table.wait_until_exists()
    print("✅ Created: Courses")
except ClientError as e:
    print(f"❌ Error creating Courses: {e}")

# ============================================
# 3. REGISTRATIONS TABLE
# ============================================
try:
    registrations_table = dynamodb.create_table(
        TableName='Registrations',
        KeySchema=[
            {'AttributeName': 'registration_id', 'KeyType': 'HASH'}
        ],
        AttributeDefinitions=[
            {'AttributeName': 'registration_id', 'AttributeType': 'S'},
            {'AttributeName': 'student_id', 'AttributeType': 'S'},
            {'AttributeName': 'course_id', 'AttributeType': 'S'}
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'student-index',
                'KeySchema': [{'AttributeName': 'student_id', 'KeyType': 'HASH'}],
                'Projection': {'ProjectionType': 'ALL'}
            },
            {
                'IndexName': 'course-index',
                'KeySchema': [{'AttributeName': 'course_id', 'KeyType': 'HASH'}],
                'Projection': {'ProjectionType': 'ALL'}
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    registrations_table.wait_until_exists()
    print("✅ Created: Registrations (with student & course GSIs)")
except ClientError as e:
    print(f"❌ Error creating Registrations: {e}")

print("\n📦 Inserting mock data...\n")

# ============================================
# MOCK DATA (with Decimal types)
# ============================================

students = [
    {
        "student_id": "S1001",
        "name": "Alice Johnson",
        "email": "alice.johnson@school.edu",
        "program": "Computer Science",
        "year": 3,
        "gpa": Decimal("3.8"),  # ← Changed to Decimal
        "status": "active"
    },
    {
        "student_id": "S1002",
        "name": "Brian Smith",
        "email": "brian.smith@school.edu",
        "program": "Information Technology",
        "year": 2,
        "gpa": Decimal("3.5"),  # ← Changed to Decimal
        "status": "active"
    },
    {
        "student_id": "S1003",
        "name": "Carla Lee",
        "email": "carla.lee@school.edu",
        "program": "Cybersecurity",
        "year": 1,
        "gpa": Decimal("3.9"),  # ← Changed to Decimal
        "status": "active"
    },
    {
        "student_id": "S1004",
        "name": "David Chen",
        "email": "david.chen@school.edu",
        "program": "Computer Science",
        "year": 4,
        "gpa": Decimal("3.6"),  # ← Changed to Decimal
        "status": "active"
    },
    {
        "student_id": "S1005",
        "name": "Emma Davis",
        "email": "emma.davis@school.edu",
        "program": "Data Science",
        "year": 2,
        "gpa": Decimal("3.7"),  # ← Changed to Decimal
        "status": "active"
    }
]

courses = [
    {
        "course_id": "CS101",
        "course_name": "Introduction to Programming",
        "program": "Computer Science",
        "instructor": "Dr. Sarah Williams",
        "credits": 3,
        "capacity": 40,
        "enrolled_count": 2,
        "schedule": "Mon/Wed 10:00-11:30 AM",
        "room": "Tech Building 201",
        "prerequisites": []
    },
    {
        "course_id": "CS202",
        "course_name": "Data Structures and Algorithms",
        "program": "Computer Science",
        "instructor": "Prof. Michael Brown",
        "credits": 4,
        "capacity": 35,
        "enrolled_count": 1,
        "schedule": "Tue/Thu 2:00-3:30 PM",
        "room": "Tech Building 305",
        "prerequisites": ["CS101"]
    },
    {
        "course_id": "IT201",
        "course_name": "Networking Fundamentals",
        "program": "Information Technology",
        "instructor": "Dr. Jennifer Lopez",
        "credits": 3,
        "capacity": 30,
        "enrolled_count": 1,
        "schedule": "Mon/Wed 1:00-2:30 PM",
        "room": "IT Lab 102",
        "prerequisites": []
    },
    {
        "course_id": "CY101",
        "course_name": "Introduction to Cybersecurity",
        "program": "Cybersecurity",
        "instructor": "Prof. Robert Taylor",
        "credits": 3,
        "capacity": 25,
        "enrolled_count": 0,
        "schedule": "Tue/Thu 10:00-11:30 AM",
        "room": "Security Lab 401",
        "prerequisites": []
    },
    {
        "course_id": "AI301",
        "course_name": "Artificial Intelligence",
        "program": "Computer Science",
        "instructor": "Dr. Lisa Chen",
        "credits": 4,
        "capacity": 20,
        "enrolled_count": 0,
        "schedule": "Mon/Wed 3:00-4:30 PM",
        "room": "Tech Building 410",
        "prerequisites": ["CS101", "CS202"]
    },
    {
        "course_id": "DB250",
        "course_name": "Database Systems",
        "program": "Information Technology",
        "instructor": "Prof. James Wilson",
        "credits": 3,
        "capacity": 30,
        "enrolled_count": 0,
        "schedule": "Tue/Thu 11:00-12:30 PM",
        "room": "Tech Building 203",
        "prerequisites": ["CS101"]
    },
    {
        "course_id": "DS201",
        "course_name": "Introduction to Data Science",
        "program": "Data Science",
        "instructor": "Dr. Maria Garcia",
        "credits": 3,
        "capacity": 28,
        "enrolled_count": 0,
        "schedule": "Mon/Wed/Fri 9:00-10:00 AM",
        "room": "Data Lab 301",
        "prerequisites": ["CS101"]
    },
    {
        "course_id": "WEB220",
        "course_name": "Web Development",
        "program": "Computer Science",
        "instructor": "Prof. Kevin Martinez",
        "credits": 3,
        "capacity": 32,
        "enrolled_count": 0,
        "schedule": "Tue/Thu 3:30-5:00 PM",
        "room": "Tech Building 115",
        "prerequisites": ["CS101"]
    }
]

registrations = [
    {
        "registration_id": str(uuid.uuid4()),
        "student_id": "S1001",
        "course_id": "CS101",
        "registration_date": "2025-01-15",
        "status": "enrolled",
        "grade": None
    },
    {
        "registration_id": str(uuid.uuid4()),
        "student_id": "S1001",
        "course_id": "CS202",
        "registration_date": "2025-01-15",
        "status": "enrolled",
        "grade": None
    },
    {
        "registration_id": str(uuid.uuid4()),
        "student_id": "S1002",
        "course_id": "IT201",
        "registration_date": "2025-01-16",
        "status": "enrolled",
        "grade": None
    },
    {
        "registration_id": str(uuid.uuid4()),
        "student_id": "S1004",
        "course_id": "CS101",
        "registration_date": "2025-01-14",
        "status": "enrolled",
        "grade": None
    }
]

# ============================================
# INSERT DATA
# ============================================

def insert_data(table_name, items):
    table = dynamodb.Table(table_name)
    success_count = 0
    for item in items:
        try:
            table.put_item(Item=item)
            success_count += 1
        except ClientError as e:
            print(f"❌ Error inserting into {table_name}: {e}")
    print(f"✅ Inserted {success_count}/{len(items)} items into {table_name}")

insert_data("Students", students)
insert_data("Courses", courses)
insert_data("Registrations", registrations)

print("\n🎉 Database setup complete!\n")

# ============================================
# VERIFICATION QUERIES
# ============================================

print("🔍 Running verification queries...\n")

# Query 1: List all courses with available spots
courses_table = dynamodb.Table('Courses')
response = courses_table.scan()
print("📚 COURSES WITH AVAILABILITY:")
for course in response['Items']:
    available = course['capacity'] - course['enrolled_count']
    status = "🟢 OPEN" if available > 0 else "🔴 FULL"
    print(f"   {status} {course['course_id']} - {course['course_name']} ({available}/{course['capacity']} spots)")

# Query 2: Alice's registrations
registrations_table = dynamodb.Table('Registrations')
response = registrations_table.query(
    IndexName='student-index',
    KeyConditionExpression='student_id = :sid',
    ExpressionAttributeValues={':sid': 'S1001'}
)
print(f"\n👩‍🎓 ALICE'S COURSES:")
for reg in response['Items']:
    course = courses_table.get_item(Key={'course_id': reg['course_id']})['Item']
    print(f"   • {reg['course_id']} - {course['course_name']}")

# Query 3: Students in CS101
response = registrations_table.query(
    IndexName='course-index',
    KeyConditionExpression='course_id = :cid',
    ExpressionAttributeValues={':cid': 'CS101'}
)
print(f"\n📖 CS101 ENROLLMENT:")
students_table = dynamodb.Table('Students')
for reg in response['Items']:
    student = students_table.get_item(Key={'student_id': reg['student_id']})['Item']
    print(f"   • {student['name']} ({student['student_id']})")

print("\n✨ All done! Your database is ready for Lex integration.\n")