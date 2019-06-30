# Description

This solution provides a REST microservice layer with express and JSingPDF library.
[JSignPDF](https://github.com/kwart/jsignpdf) is a Java project that sign and verify PDF files.

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

# 3. REST Services

| Reference | Resource | Http Method |
| --- | --- | --- |
| **1 - Retrieve the public key** | `/pdf/public-key` | `GET` |
| **2 - Sign PDF Document** | `/pdf/sign` | `POST` |
| **3 - Verify PDF Document** | `/pdf/verify` | `POST` |

## 3.1 - Retrieve the public key

This resource retrieve the public key to encrypt keystore password.

### Parameters

You don't need to pass any parameter.

### Response

| Http Status | Content-Type | Response |
| --- | --- | --- |
| **200** | `text/plain` | The public key text |
| **500** | `text/plain` | Error message |

## 3.2 - Sign PDF Document

This resource sign a PDF Document.

### Parameters

| Parameter | Type | Required | Response |
| --- | --- | --- | --- |
| **pdf** | `body` | `yes` | PDF stream |
| **p12** | `body` | `yes` | P12 stream |
| **password** | `body` | `yes` | Encrypted P12 password |
| **filename** | `body` | `no` | PDF Filename for the response. **If not passed the file will call `signed_document`** |

### Response

| Http Status | Content-Type | Response |
| --- | --- | --- |
| **200** | `application/pdf` | Signed PDF |
| **500** | `text/plain` | Error message |

## 3.3 - Verify PDF Document

This resource verify a Signed PDF Document.

### Parameters

| Parameter | Type | Required | Response |
| --- | --- | --- | --- |
| **pdf** | `body` | `yes` | Signed PDF stream |

### Response

| Http Status | Content-Type | Response |
| --- | --- | --- |
| **200** | `text/plain` | String containing the verified resolution |
| **500** | `text/plain` | Error message |