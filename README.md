# gobarber-backend

**Estudos RocketSeat**

##

## SESSIONS

> **Create new session**

Ex:

```
method: POST
url: http://localhost:3333/sessions
```

### Params:

```
{
	"email": "email@email.com",
	"password": "mypassword"
}
```

#

## USERS

### Headers:

```
Authorization bearer YOUR_AUTH_TOKEN_HERE
```

> **Create new user**

Ex:

```
method: POST
url: http://localhost:3333/users
```

### Params:

```
{
	"name": "My name",
	"email": "email@email.com",
	"password": "mypassword",
}
```

> **Update user**

Ex:

```
method: PUT
url: http://localhost:3333/users
```

### Params:

```
{
	"name": "My name",
	"oldPassword": "myOldPassword",
	"password": "myNewPassword",
	"passwordConfirm": "myNewPassword"
}
```

#

## Files

> **Store new file**

### Headers:

```
Authorization bearer YOUR_AUTH_TOKEN_HERE
```

Ex:

```
method: POST
url: http://localhost:3333/files
```

### Params:

**Multipart form**
Ex:

```
{
	"file": "avatar.jpg",
}
```

#

## Providers

> **Request all providers**

### Headers:

```
Authorization bearer YOUR_AUTH_TOKEN_HERE
```

Ex:

```
method: GET
url: http://localhost:3333/providers
```

## Availables dates

### Headers:

```
Authorization bearer YOUR_AUTH_TOKEN_HERE
```

> **List all availables dates for new appointment**

Ex:

```
method: GET
url: http://localhost:3333/providers/:providerId/available?date=1579442903184
```

### Params:

**_timestamp date format_**

```
{
	"providerId": 1
	"date": 1579442903184,
}
```

## Appointments

### Headers:

```
Authorization bearer YOUR_AUTH_TOKEN_HERE
```

> **Create new appointment**

Ex:

```
method: POST
url: http://localhost:3333/appointments
```

### Params:

```
{
	"provider_id": 1,
	"date": "2020-01-19T18:00:00-03:00"
}
```

> **List all appointment**

Ex:

```
method: GET
url: http://localhost:3333/appointments?page=1
```

### Params:

```
{
	"page": 1
}
```

> **Canceled one appointment**

Ex:

```
method: DELETE
url: http://localhost:3333/appointments/:id
```

### Params:

```
{
	"id": 1
}
```

## Schedules

### Headers:

```
Authorization bearer YOUR_AUTH_TOKEN_HERE
```

> **List all schedules for providers**

Ex:

```
method: GET
url: http://localhost:3333/schedules?date=2020-01-18T00%3A00%3A00-03%3A00
```

### Params:

```
{
	"date": 2020-01-18T00:00:00-03:00,
}
```

## Notifications

### Headers:

```
Authorization bearer YOUR_AUTH_TOKEN_HERE
```

> **List all notifications for providers**

Ex:

```
method: GET
url: http://localhost:3333/notifications
```

> **Update one notification**

Ex:

```
method: PUT
url: http://localhost:3333/notifications/:id
```

### Params:

```
{
	"id": 5e236b3e3ecfb906e1a0ab83,
}
```
