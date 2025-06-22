import logging
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSignupSerializer, UserSerializer

# Configure logger
logger = logging.getLogger(__name__)

@api_view(['POST'])
def signup(request):
    """
    User signup endpoint using custom User model
    """
    logger.info(f"Signup request received from {request.META.get('REMOTE_ADDR', 'unknown')}")
    logger.info(f"Request data keys: {list(request.data.keys())}")

    if request.method == 'POST':
        serializer = UserSignupSerializer(data=request.data)

        if serializer.is_valid():
            try:
                logger.info(f"Serializer validation passed for user: {request.data.get('username', 'unknown')}")
                user = serializer.save()
                user_data = UserSerializer(user).data

                logger.info(f"User created successfully: {user.username} (ID: {user.id})")

                return Response({
                      'success': True,
                      'message': 'User created successfully',
                      'user': user_data
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                logger.error(f"Failed to create user: {str(e)}")
                logger.error(f"Exception type: {type(e).__name__}")

                return Response({
                    'success': False,
                    'message': 'Failed to create user',
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        else:
            logger.error(f"Validation failed for signup request")
            logger.error(f"Validation errors: {serializer.errors}")

            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        