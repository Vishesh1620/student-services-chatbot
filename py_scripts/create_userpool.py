import boto3
import json

cognito = boto3.client('cognito-idp', region_name='us-east-1')

try:
    # Create User Pool with custom attribute
    response = cognito.create_user_pool(
        PoolName='StudentChatbotUserPool',
        Policies={
            'PasswordPolicy': {
                'MinimumLength': 8,
                'RequireUppercase': True,
                'RequireLowercase': True,
                'RequireNumbers': True,
                'RequireSymbols': True
            }
        },
        Schema=[
            {
                'Name': 'email',
                'AttributeDataType': 'String',
                'Required': True,
                'Mutable': True
            },
            {
                'Name': 'name',
                'AttributeDataType': 'String',
                'Required': True,
                'Mutable': True
            },
            {
                'Name': 'student_id',
                'AttributeDataType': 'String',
                'Mutable': True,
                'DeveloperOnlyAttribute': False
            }
        ],
        AutoVerifiedAttributes=['email'],
        UsernameAttributes=['email'],
        UsernameConfiguration={
            'CaseSensitive': False
        }
    )
    
    user_pool_id = response['UserPool']['Id']
    print(f"[OK] User Pool created: {user_pool_id}")
    
    # Create User Pool Client
    client_response = cognito.create_user_pool_client(
        UserPoolId=user_pool_id,
        ClientName='StudentChatbotClient',
        GenerateSecret=False,
        ExplicitAuthFlows=[
            'ALLOW_USER_PASSWORD_AUTH',
            'ALLOW_REFRESH_TOKEN_AUTH',
            'ALLOW_USER_SRP_AUTH'
        ],
        PreventUserExistenceErrors='ENABLED'
    )
    
    client_id = client_response['UserPoolClient']['ClientId']
    print(f"[OK] User Pool Client created: {client_id}")
    
    print("\n[DONE] Update your aws-config.js with:")
    print(f"  userPoolId: '{user_pool_id}'")
    print(f"  userPoolClientId: '{client_id}'")
    
except Exception as e:
    print(f"[ERROR] {e}")
