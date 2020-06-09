# Project Structure for backend	
```
├───controllers
|   |-bins.js
|   |-users.js  
├───middleware
├───models
|    |-User.js   	
|    |-Bin.js
├───routes
|    |-users.js 
|    |-bins.js
└───utils
```

## Resources

### User Endpoints

```
    GET
    /users

    Response Object = [
            {
        "id":"Object ID",
        "username":"username",
        "password": "password",
        "email" : "email",
        "lastLogin" : date,
        "user_id" : "UUID"
        }
    ]

    GET
    /users/:id

    POST
    /users
    Request Object = {
    "username": "username",
    "password": "password",
    "email": "email"
    }
    PUT
    /users/:id
    Request Object = {
    "username": "username",
    "password": "password",
    "email": "email"
    }
    DELETE
    /users/:id
    Request Object = {
    "email": "email@email.com",
    "password": "password"
    }

```

### Bin Endpoints

```
    GET
    /bins

    Response object = [
            {
        "id": "Object ID",
        "bin_code" : "",
        "lastEmptied" : "",
        "lat" : "",
        "lng" : "",
        "max_height" : "",
        "current_height" :"",
        "active": boolean
        }
    ]

    GET
    /bins/:id

    Request object: {
            "bin_code": "UUID" 
        }

    Response object: {
            "id": "Object ID",
            "bin_code" : "",
            "lastEmptied" : "",
            "lat" : "",
            "lng" : "",
            "max_height" : "",
            "current_height" :"",
            "active": boolean
         }

    POST
    /bins

    Request object: {
        "bin_code" : "",
        "lat" : "",
        "lng" : "",
        "max_height" : ""
        }

    PUT
    /bins/:id
    Request object:   {
        "bin_code" : "UUID",
        "current_height" :""
        }

    DELETE
    /bins/:id

    Request object: {
    "bin_code": "UUID"
    }

```
 