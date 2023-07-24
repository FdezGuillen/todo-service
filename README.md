## Description

TODO API for technical test.

## Setup and launch
1 - Copy .env file in root directory with variables LABEL_SERVICE_EXTERNAL_PATH, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_REGION (ask the creator)

2- Run command
```bash
$ docker-compose up
```
3- Send HTTP requests to localhost:3000

## Test

```bash
# unit tests
$ npm run test
```

## API
Pending of refining a proper Swagger documentation following OpenAPI specification. For now, these are the available endpoints:

GET /todo -> List of all TODO tasks in the database
GET /todo/{id} -> Returns the TODO whose id matches with the provided one (uuid format)
POST /todo -> Creates a TODO. Body must comply with the following format:
```bash
{
    "message": "TODO message", # required, min length 3, max length 500
    "label": {
        "id": "Label id" # required
    },
    "dueDate": "2023-12-31T00:00:00Z" # required, ISO-8601 valid format
}
```
UPDATE /todo/{id} -> Updates the TODO whose id matches with the provided one (uuid format). Accepts same body as POST
DELETE /todo/{id} -> Deletes the TODO whose id matches with the provided one (uuid format)

## Main decissions taken
- The Controller-Service-Repository pattern was chosen for this project due to its simplicity in separating concerns. Additionally, the requests to the third party Label service are managed in LabelIntegration, which can be injected in any service.
- One of the proposed problems was the instability of the Label service, which can return an error or response times. The proposed solution is having an in-memory cache for labels that is updated when the user tries to use a label that it's not saved in cache. Note that the TTL for each of this label in cache is around 1 hour. In the case there is no label in cache and the http request fails, a 503 error is returned. However, more solutions to these problems could be researched further.
- Technologies implemented are the Nestjs framework (because of its utilities for building a backend service) and a cloud DynamoDB managed with dynamoose. Nevertheless, technologies would usually be decided after a proper research and team discussions.
- Secrets are provided by an .env file to keep it simple since this is a technical test, but in a real work environment these secrets should be encrypted, replaced, managed, etc.

## Problems
- For the update operation, PUT verb was implemented instead of PATCH in order to not deal with different partial bodies, but in a real project this decision could be different
- UUIDs had to be generated manually before inserting with Node.js' built in crypto package
- Defining custom types for TODO and Label worked when launching the service, but Visual Studio couldn't interpret them while debugging. I couldn't find a solution, hence why you can see the types being exported.