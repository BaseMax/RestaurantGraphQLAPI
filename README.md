# RestaurantGraphQL API

The RestaurantGraphQL API is a GraphQL-based API designed to handle multiple restaurants in a shop store. It provides various features such as searching for restaurants in a city, finding the nearest restaurant, retrieving a list of foods offered by a restaurant, and more. This README file provides an overview of the API and instructions on how to use it.

## Features

The RestaurantGraphQL API offers the following features:

- Search in a city: Users can search for restaurants in a specific city by providing the city name as a parameter.
- Distance calculation: The API can calculate the distance between a given location and all the restaurants, enabling users to find the nearest restaurant.
- Retrieve restaurant details: Users can retrieve detailed information about a specific restaurant, including its name, address, contact details, opening hours, and more.
- Get a list of foods: The API allows users to fetch a list of foods offered by a restaurant, including their names, descriptions, prices, and any other relevant details.
- Filtering: Users can apply various filters while searching for restaurants, such as cuisine type, price range, ratings, and more.

## Available Queries
The following queries are available in the API:

- `restaurants(query: SearchRestaurantsInput!)`: Returns a list of restaurants based on the provided search query.
- `restaurant(id: ID!)`: Returns detailed information about a specific restaurant.
- `food(id: ID!)`: Returns detailed information about a specific food item.
- `foods(restaurantId: ID!, pagination: Pagination!)`: Returns a list of food items offered by a specific restaurant.
- `reviews(restaurantId: ID!, pagination: Pagination!)`: Returns a list of reviews for a specific restaurant.
- `user`: Returns information about the currently authenticated user.
- `getAllUsers`: Returns a list of all users (requires superadmin role).

## Available Mutations
The following mutations are available in the API:

- `register(input: RegisterUserInput!)`: Registers a new user with the provided information.
- `login(input: LoginUserInput!)`: Logs in an existing user with the provided information.
- `createRestaurant(input: CreateRestaurantInput!)`: Creates a new restaurant (requires admin or superadmin role).
- `updateRestaurant(input: UpdateRestaurantInput!)`: Updates an existing restaurant (requires admin or superadmin role).
- `deleteRestaurant(id: String!)`: Deletes an existing restaurant (requires admin or superadmin role).
- `createFood(input: CreateFoodInput!)`: Creates a new food item for a specific restaurant (requires admin or superadmin role).
- `updateFood(input: UpdateFoodInput!)`: Updates an existing food item (requires admin or superadmin role).
- `deleteFood(id: String!)`: Deletes an existing food item (requires admin or superadmin role).
- `createReview(input: CreateReviewInput!)`: Creates a new review for a specific restaurant.

## Usage

### Clone the repo
Clone this repositoryto get the source code:

```
git clone https://github.com/basemax/RestaurantGraphqlApi
```

### Install dependencies
Run `npm install` to install Node dependencies:

```
npm install
```

### Create admin account  
Run the following command to create a superuser account:

```
npx nest start --entryFile create-admin.js
```

It will prompt you for an email, password, and name to create the superuser account.

### Run in development
Run the app using Docker Compose:

```
sudo docker-compose -f docker-compose.dev.yml up
``` 

This will start the app in development mode, with hot reloading enabled.

The GraphQL playground will be available at `http://localhost:3000/graphql`


# Examples

Here are some examples of queries and mutations that can be executed using the RestaurantGraphQL API:

### Query for restaurants in a specific city
```
query {
  restaurants(query: {city: "New York"}) {
    id
    name
    location {
      latitude
      longitude
    }
    address
    rating
    cuisine
  }
}
```

### Query for a specific restaurant and its details
```
query {
  restaurant(id: "12345") {
    id
    name
    location {
      latitude
      longitude
    }
    address
    rating
    cuisine
    contact {
      email
      phone
    }
    openingHours {
      day
      hours
    }
  }
}
```

### Query for a list of foods offered by a restaurant
```
query {
  foods(restaurantId: "12345", pagination: {limit: 10, skip: 0}) {
    id
    name
    description
    price
  }
}
```

### Mutation to create a new restaurant
```
mutation {
  createRestaurant(input: {
    name: "New Restaurant",
    location: {latitude: 51.5074, longitude: 0.1278},
    address: "123 Main Street",
    rating: 4.5,
    cuisine: "Italian",
    contact: {email: "info@newrestaurant.com", phone: "123-456-7890    "},
    openingHours: [
      {day: Monday, hours: "10:00-22:00"},
      {day: Tuesday, hours: "10:00-22:00"},
      {day: Wednesday, hours: "10:00-22:00"},
      {day: Thursday, hours: "10:00-22:00"},
      {day: Friday, hours: "10:00-23:00"},
      {day: Saturday, hours: "11:00-23:00"},
      {day: Sunday, hours: "11:00-22:00"}
    ]
  }) {
    id
    name
    location {
      latitude
      longitude
    }
    address
    rating
    cuisine
  }
}
```

### Mutation to update an existing restaurant
```
mutation {
  updateRestaurant(input: {
    id: "12345",
    name: "Updated Restaurant Name",
    rating: 4.8
  }) {
    id
    name
    rating
  }
}
```

### Mutation to delete a food item
```
mutation {
  deleteFood(id: "12345")
}
```

# API Documentation

This API uses GraphQL to provide data about restaurants and their menus.

## Queries

### Restaurant queries

- `restaurants(query: SearchRestaurantsInput)` - Returns all restaurants matching the search parameters. You can search by:
  - `name`
  - `city`
  - `cuisine`
  - `minPrice` 
  - `maxPrice`
  - `nearBy { radius, latitude, longitude }`

- `restaurant(id: ID!)` - Returns a single restaurant object by ID.

- `distance(location: LocationInput!)` - Returns the distance between a given location and the restaurant.

### Food menu queries

- `food(id: ID!)` - Returns a single food item by ID.

- `foods(restaurantId: ID!, pagination: Pagination)` - Returns all food items for a restaurant, with pagination. Pagination parameters are:
  - `limit` 
  - `skip`

### Review queries

- `reviews(restaurantId: ID!, pagination: Pagination)` - Returns all reviews for a restaurant, paginated.

- `user` - Returns the current authenticated user object.

## Mutations

### Restaurant mutations

- `createRestaurant(input: CreateRestaurantInput!)` - Creates a new restaurant. Input fields are:
  - `name`
  - `location { latitude, longitude }`
  - `address`
  - `rating`  
  - `cuisine`   
  - `contact { email, phone }`
  - `openingHours [ { day, hours } ]`

- `updateRestaurant(input: UpdateRestaurantInput!)` - Updates an existing restaurant. Requires the `id` field.

- `deleteRestaurant(id: String!)` - Requires admin role.

### Food menu mutations

- `createFood(input: CreateFoodInput!)` - Requires admin role. Input fields are:
  - `name`
  - `description`
  - `price`  
  - `restaurantId`

- `updateFood(input: UpdateFoodInput!)` - Requires admin role. 

- `deleteFood(id: String!)` - Requires admin role.

### Review mutations

- `createReview(input: CreateReviewInput!)` - Requires authentication. Input fields are:
  - `restaurantId`  
  - `rating`
  - `comment`

### User mutations

- `changeRole(newRole: Role!, userId: String!)` - Requires superadmin role. Changes a user's role.

Let me know if you have any other questions about the API! I can expand on any part in more detail.
## Security
Roles:  

- `user` - Basic access  
- `admin` - Manage restaurants and menu    
- `superadmin` - Manage all users and roles

Authentication uses JWT tokens.

Let me know if you have any other questions!
## Contributing

If you encounter any issues or have suggestions for improvements, please submit an issue or a pull request to the GitHub repository.

## License

The RestaurantGraphQL API is open-source and released under the GPL-V3.0 License. Feel free to use, modify, and distribute the code as per the terms of the license.
