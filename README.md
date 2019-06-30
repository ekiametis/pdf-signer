# Description

This solution provides a REST service with express and JSingPDF library. [JSignPDF](https://github.com/kwart/jsignpdf) is a Java project that sign and verify PDF files.

# Requirements

- **Docker** >= 17.12.0-ce
- **docker-compose (OPTIONAL)** >= 1.21.0

# 1. Installing

To run the service you will use a container solution through a Docker image.
**In our tutorial we'll use `docker-compose` to make it easier to configure the environment**.

- First download the project to your local environment via the command: `git clone https://github.com/ekiametis/pdf-signer.git`
- In the project root folder, **execute one of the following commands**:

## 1.1 Docker

```
docker run -e PRIVATE_KEY_FILE_PATH='./keys/private.pem' \ 
-e PUBLIC_KEY_FILE_PATH='./keys/public.pub' \
-p 4000:8080 \
--name pdf-signer-service pdf-signer-service
```

## 1.2 Docker-compose

### 1.2.1 Docker-compose simples

```
docker-compose up
```

# 2. Configurations

## 2.1 Environment Variables

- `PRIVATE_KEY_FILE_PATH`
    - **REQUIRED**
    - Private key to decrypt the keystore password.
- `PUBLIC_KEY_FILE_PATH`
    - **REQUIRED**
    - Public key to encrypt the keystore password.
- `PORT` 
    - **OPTIONAL | DEFAULT = 8080**
    - Node server port.