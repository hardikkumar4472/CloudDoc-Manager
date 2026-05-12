namespace      = "clouddoc-terraform"
backend_image  = "hardik010190/clouddoc-backend:latest"
frontend_image = "hardik010190/clouddoc-frontend:latest"

# These should be filled or passed via command line/env variables for security
mongo_uri         = "your_mongodb_uri_here"
jwt_access_secret = "your_jwt_access_secret_here"
