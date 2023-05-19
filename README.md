# RestaurantGraphQL API
This API uses GraphQL to expose details about restaurants and their menus. It allows users to search for restaurants, view food items and reviews, and (for admins) manage restaurant and food data.  

## Features
- Search restaurants by city, cuisine, name, price range, and proximity
- View restaurant details: name, address, contact info, opening hours
- Calculate distance to a restaurant
- Get food menu items: name, description, price
- Create, update and delete menu items (for admins)
- View customer reviews 
- Create reviews (for authenticated users)   
- Manage users and assign roles (for superadmins)

## Queries
- `restaurants` - Search and filter restaurants
- `restaurant` - Get a specific restaurant
- `food` - Get a food item        
- `foods` - Get all menu items for a restaurant
- `reviews` - Get reviews for a restaurant
- `user` - Get the authenticated user   

## Mutations
- `createRestaurant`    
- `updateRestaurant`
- `deleteRestaurant`  
- `createFood`
- `updateFood`    
- `deleteFood`
- `createReview`       
- `changeRole`  
# Usage 

## Usage

### Clone the repo
Clone this repository to get the source code:

```
git clone https://github.com/basemax/RestaurantGraphqlApi
```

### Install dependencies
Run `npm install` to install Node dependencies:

```
npm install
```
### Create admin account  
```
npx nest start --entryFile create-admin.js
```
and it will ask you for email password and name and it will create a superuser account 

### Run in development
Run the app using Docker Compose:

```
sudo docker-compose -f docker-compose.dev.yml up
``` 

This will start the app in development mode, with hot reloading enabled.

The GraphQL playground will be available at `http://localhost:3000/graphql`


# Examples 
Queries:

1. Get all restaurants:
```graphql
{
  restaurants {
    name
    location {
      latitude
      longitude
    }  
  }
}
```

2. Get a specific restaurant by ID:
```graphql 
{
  restaurant(id: "1") {
    name
    cuisine
    openingHours {
      day
      hours  
    }
  }
}
```

3. Get foods for a restaurant:
```graphql
{
  foods(restaurantId: "1") {
    name
    description
    price
  }
}
```

4. Get reviews for a restaurant:
```graphql
{
  reviews(restaurantId: "1") {
    rating
    comment   
  }
}
}
```

5. Search restaurants by city:
```graphql
{
  restaurants(query: {
    city: "Paris"
  }) {
   name  
  }
}
```

Mutations:

6. Create a new restaurant: 
```graphql
mutation {
  createRestaurant(input: {
    name: "La Table"
    location: {
      longitude: 2.3456
      latitude: 48.8534
    }  
  }) {
    id
  }  
}
```

7. Update a restaurant:
```graphql
mutation {
  updateRestaurant(input: {
    id: "1"
    name: "New Restaurant Name"
  }) {
    name  
  }
}
```

8. Create a new food item:
```graphql
mutation {
  createFood(input: {
    name: "Steak Frites"    
    price: 20
    restaurantId: "1"
  }) {
    id   
  }
}
```

9. Create a new review:
```graphql
mutation {
  createReview(input: {  
    restaurantId: "1"   
    rating: 5
    comment: "Great food and service!"
  }) {
    id  
  }
}
```

10. Change a user's role:
```graphql
mutation {
  changeRole(newRole: admin, userId: "2") {
    role   
  }  
}
```

Hope this helps! Let me know if you have any other questions.
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
## Usage

To interact with the RestaurantGraphQL API, you need a GraphQL client or an API testing tool. Here's an example using cURL:

Make a POST request to the API endpoint (http://localhost:3000/graphql) with the following headers:

```bash
Content-Type: application/json
```

Send a GraphQL query as the request payload. Here's an example query to search for restaurants in a city:

```graphql
query {
  restaurants(city: "New York") {
    id
    name
    address
    cuisine
    rating
  }
}
```

Replace "New York" with the desired city name.

Receive the response from the server, containing the list of restaurants in the specified city.

For detailed documentation on the available queries, mutations, and types, refer to the API documentation or the GraphQL schema.

## Examples

Here are some additional examples of GraphQL queries and mutations for various features of the RestaurantGraphQL API:

### Search in a City

Request:

```graphql
query {
  restaurants(city: "London") {
    id
    name
    address
    cuisine
    rating
  }
}
```

Response:

```json
{
  "data": {
    "restaurants": [
      {
        "id": "1",
        "name": "The Best Pizza",
        "address": "123 Main St",
        "cuisine": "Italian",
        "rating": 4.5
      },
      {
        "id": "2",
        "name": "Burger Joint",
        "address": "456 Elm St",
        "cuisine": "American",
        "rating": 4.2
      },
      ...
    ]
  }
}
```

### Calculate Distance

Request:

```graphql
query {
  calculateDistance(latitude: 40.7128, longitude: -74.0060) {
    restaurant {
      id
      name
      address
      distance
    }
  }
}
```

Response:

```json
{
  "data": {
    "calculateDistance": [
      {
        "restaurant": {
          "id": "1",
          "name": "The Best Pizza",
          "address": "123 Main St",
          "distance": 2.3
        }
      },
      {
        "restaurant": {
          "id": "2",
          "name": "Burger Joint",
          "address": "456 Elm St",
          "distance": 1.8
        }
      },
      ...
    ]
  }
}
```

### Retrieve Restaurant Details

Request:

```graphql
query {
  restaurant(id: "1") {
    name
    address
    contact {
      phone
      email
    }
    openingHours {
      day
      hours
    }
  }
}
```

Response:

```json
{
  "data": {
    "restaurant": {
      "name": "The Best Pizza",
      "address": "123 Main St",
      "contact": {
        "phone": "555-1234",
        "email": "info@bestpizza.com"
      },
      "openingHours": [
        {
          "day": "Monday",
          "hours": "11:00 AM - 9:00 PM"
        },
        {
          "day": "Tuesday",
          "hours": "11:00 AM - 9:00 PM"
        },
        ...
      ]
    }
  }
}
```

### Get List of Foods

Request:

```graphql
query {
  foods(restaurantId: "1") {
    id
    name
    description
    price
  }
}
```

Response:

```json
{
  "data": {
    "foods": [
      {
        "id": "1",
        "name": "Margherita Pizza",
        "description": "Classic cheese and tomato pizza",
        "price": 12.99
      },
      {
        "id": "2",
        "name": "Pepperoni Pizza",
        "description": "Pizza topped with pepperoni slices",
        "price": 14.99
      },
      ...
    ]
  }
}
```

### Filtering Restaurants

Request:

```graphql
query {
  restaurants(city: "Paris", cuisine: "French", priceRange: { min: 20, max: 50 }) {
    id
    name
    address
    cuisine
    rating
  }
}
```

Response:

```json
{
  "data": {
    "restaurants": [
      {
        "id": "1",
        "name": "Le Petit Bistro",
        "address": "789 Rue de la Paix",
        "cuisine": "French",
        "rating": 4.8
      },
      {
        "id": "2",
        "name": "La Brasserie",
        "address": "456 Avenue des Champs-Élysées",
        "cuisine": "French",
        "rating": 4.5
      },
      ...
    ]
  }
}
```

### Create a Restaurant

Request:

```graphql
mutation {
  createRestaurant(
    name: "Sushi Express",
    address: "123 Sakura St",
    city: "Tokyo",
    cuisine: "Japanese",
    rating: 4.6
  ) {
    id
    name
    address
    cuisine
    rating
  }
}
```

Response:

```json
{
  "data": {
    "createRestaurant": {
      "id": "3",
      "name": "Sushi Express",
      "address": "123 Sakura St",
      "cuisine": "Japanese",
      "rating": 4.6
    }
  }
}
```

### Update Restaurant Details

Request:

```graphql
mutation {
  updateRestaurant(
    id: "3",
    address: "456 Cherry Blossom Ave",
    rating: 4.8
  ) {
    id
    name
    address
    rating
  }
}
```

Response:

```json
{
  "data": {
    "updateRestaurant": {
      "id": "3",
      "name": "Sushi Express",
      "address": "456 Cherry Blossom Ave",
      "rating": 4.8
    }
  }
}
```

### Delete a Restaurant

Request:

```graphql
mutation {
  deleteRestaurant(id: "3") {
    id
    name
    address
  }
}
```

Response:

```json
{
  "data": {
    "deleteRestaurant": {
      "id": "3",
      "name": "Sushi Express",
      "address": "456 Cherry Blossom Ave"
    }
  }
}
```

### Get Reviews for a Restaurant

Request:

```graphql
query {
  restaurant(id: "1") {
    name
    reviews {
      id
      rating
      comment
      user {
        name
      }
    }
  }
}
```

Response:

```json
{
  "data": {
    "restaurant": {
      "name": "The Best Pizza",
      "reviews": [
        {
          "id": "1",
          "rating": 5,
          "comment": "Delicious pizza! Highly recommended.",
          "user": {
            "name": "John Doe"
          }
        },
        {
          "id": "2",
          "rating": 4,
          "comment": "Good pizza, but could be better.",
          "user": {
            "name": "Jane Smith"
          }
        },
        ...
      ]
    }
  }
}
```

### Add a Review for a Restaurant

Request:

```graphql
mutation {
  addReview(
    restaurantId: "1",
    rating: 4,
    comment: "Great service and tasty food!"
  ) {
    id
    rating
    comment
    user {
      name
    }
  }
}
```

Response:

```json
{
  "data": {
    "addReview": {
      "id": "3",
      "rating": 4,
      "comment": "Great service and tasty food!",
      "user": {
        "name": "Emily Johnson"
      }
    }
  }
}
```

### Get Popular Restaurants

Request:

```graphql
query {
  popularRestaurants(limit: 5) {
    id
    name
    address
    cuisine
    rating
  }
}
```

Response:

```json
{
  "data": {
    "popularRestaurants": [
      {
        "id": "1",
        "name": "The Best Pizza",
        "address": "123 Main St",
        "cuisine": "Italian",
        "rating": 4.5
      },
      {
        "id": "4",
        "name": "Taco Fiesta",
        "address": "789 Elm St",
        "cuisine": "Mexican",
        "rating": 4.3
      },
      ...
    ]
  }
}
```

### Get Restaurants by Price Range

Request:

```graphql
query {
  restaurantsByPriceRange(minPrice: 10, maxPrice: 20) {
    id
    name
    address
    cuisine
    rating
  }
}
```

Response:

```json
{
  "data": {
    "restaurantsByPriceRange": [
      {
        "id": "1",
        "name": "The Best Pizza",
        "address": "123 Main St",
        "cuisine": "Italian",
        "rating": 4.5
      },
      {
        "id": "3",
        "name": "Sushi Express",
        "address": "456 Cherry Blossom Ave",
        "cuisine": "Japanese",
        "rating": 4.8
      },
      ...
    ]
  }
}
```

### Get Restaurants by Cuisine Type

Request:

```graphql
query {
  restaurantsByCuisine(cuisine: "Chinese") {
    id
    name
    address
    cuisine
    rating
  }
}
```

Response:

```json
{
  "data": {
    "restaurantsByCuisine": [
      {
        "id": "1",
        "name": "Taste of China",
        "address": "123 Main St",
        "cuisine": "Chinese",
        "rating": 4.5
      },
      {
        "id": "2",
        "name": "Dragon Palace",
        "address": "456 Elm St",
        "cuisine": "Chinese",
        "rating": 4.2
      },
      ...
    ]
  }
}
```

### Search Restaurants by Name

Request:

```graphql
query {
  searchRestaurantsByName(name: "Pizza") {
    id
    name
    address
    cuisine
    rating
  }
}
```

Response:

```json
{
  "data": {
    "searchRestaurantsByName": [
      {
        "id": "1",
        "name": "The Best Pizza",
        "address": "123 Main St",
        "cuisine": "Italian",
        "rating": 4.5
      },
      {
        "id": "5",
        "name": "Pizza Hut",
        "address": "789 Elm St",
        "cuisine": "Italian",
        "rating": 4.0
      },
      ...
    ]
  }
}
```

### Get Nearby Restaurants

Request:

```graphql
query {
  nearbyRestaurants(latitude: 40.7128, longitude: -74.0060, radius: 5) {
    id
    name
    address
    cuisine
    rating
  }
}
```

Response:

```json
{
  "data": {
    "nearbyRestaurants": [
      {
        "id": "1",
        "name": "The Best Pizza",
        "address": "123 Main St",
        "cuisine": "Italian",
        "rating": 4.5
      },
      {
        "id": "3",
        "name": "Sushi Express",
        "address": "456 Cherry Blossom Ave",
        "cuisine": "Japanese",
        "rating": 4.8
      },
      ...
    ]
  }
}
```

### Create a Food Item

Request:

```graphql
mutation {
  createFood(
    restaurantId: "1",
    name: "Cheeseburger",
    description: "Juicy beef patty with melted cheese",
    price: 9.99
  ) {
    id
    name
    description
    price
  }
}
```

Response:

```json
{
  "data": {
    "createFood": {
      "id": "6",
      "name": "Cheeseburger",
      "description": "Juicy beef patty with melted cheese",
      "price": 9.99
    }
  }
}
```

### Update a Food Item

Request:

```graphql
mutation {
  updateFood(
    id: "6",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with American cheese",
    price: 10.99
  ) {
    id
    name
    description
    price
  }
}
```

Response:

```json
{
    ...
}
```



These examples showcase a range of additional features and demonstrate how you can use GraphQL queries and mutations to interact with the RestaurantGraphQL API. Feel free to customize and extend them based on your specific requirements.

## Contributing

If you encounter any issues or have suggestions for improvements, please submit an issue or a pull request to the GitHub repository.

## License

The RestaurantGraphQL API is open-source and released under the GPL-V3.0 License. Feel free to use, modify, and distribute the code as per the terms of the license.
