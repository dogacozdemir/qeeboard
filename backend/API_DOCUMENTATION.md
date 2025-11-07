# API Documentation

## Configs API

### GET /api/configs
Get all keyboard configurations with related data.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "My Keyboard Config",
      "description": "A custom keyboard layout",
      "layoutData": {...},
      "previewUrl": "https://...",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "tags": [...],
      "versions": [...],
      "_count": {
        "favorites": 5,
        "comments": 3
      }
    }
  ]
}
```

### POST /api/configs
Create a new keyboard configuration.

**Request Body:**
```json
{
  "userId": 1,
  "name": "My New Config",
  "description": "Description here",
  "layoutData": {...},
  "previewUrl": "https://...",
  "tagIds": [1, 2, 3]
}
```

### GET /api/configs/[id]
Get a specific configuration by ID.

### PUT /api/configs/[id]
Update a configuration.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "layoutData": {...},
  "previewUrl": "https://...",
  "tagIds": [1, 2]
}
```

### DELETE /api/configs/[id]
Delete a configuration.

## Favorites API

### POST /api/favorites
Add a configuration to favorites.

**Request Body:**
```json
{
  "userId": 1,
  "configId": 5
}
```

### DELETE /api/favorites
Remove a configuration from favorites.

**Request Body:**
```json
{
  "userId": 1,
  "configId": 5
}
```

## Comments API

### POST /api/comments
Add a comment to a configuration.

**Request Body:**
```json
{
  "userId": 1,
  "configId": 5,
  "content": "Great keyboard layout!",
  "rating": 5
}
```

## Analytics API

### POST /api/analytics/color
Track color usage analytics.

**Request Body:**
```json
{
  "userId": 1,
  "color": "#FF0000"
}
```

### POST /api/analytics/event
Log user events for analytics.

**Request Body:**
```json
{
  "userId": 1,
  "event": "config_created",
  "metadata": {
    "configId": 5,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**Valid Events:**
- `config_created`
- `config_updated`
- `config_deleted`
- `config_viewed`
- `config_favorited`
- `config_unfavorited`
- `comment_added`
- `color_used`
- `user_registered`
- `user_logged_in`

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

## Listings API (Commerce)

### GET /api/listings
List active listings with related config summary and seller.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "priceCents": 2999,
      "currency": "USD",
      "stock": 10,
      "isActive": true,
      "config": { "id": 1, "name": "Starter Config", "previewUrl": "https://...", "userId": 3 },
      "seller": { "id": 3, "name": "Demo User" }
    }
  ]
}
```

### GET /api/listings/:id
Listing detail with full `config` includes (user, versions, tags, counts).

### POST /api/listings
Create a listing.
```json
{ "configId": 1, "sellerId": 3, "priceCents": 2999, "currency": "USD", "stock": 10, "isActive": true }
```

### PUT /api/listings/:id
Update listing fields.

### DELETE /api/listings/:id
Soft-deactivate listing (`isActive = false`).

## Cart API

### GET /api/cart?userId=1
Returns or creates the user's cart with items and listing details.

### POST /api/cart/items
Add an item to cart.
```json
{ "userId": 3, "listingId": 1, "quantity": 2 }
```

### PUT /api/cart/items/:itemId
Update cart item quantity.
```json
{ "quantity": 3 }
```

### DELETE /api/cart/items/:itemId
Remove a cart item.

## Orders API

### GET /api/orders?userId=1
List user's orders with items and addresses.

### GET /api/orders/:id
Get order detail.

### POST /api/orders/checkout
Create an order from the user's cart (no payment integration yet).
```json
{ "userId": 3, "shippingAddressId": 1, "billingAddressId": 2 }
```

## Addresses API

### GET /api/addresses?userId=1
List user's addresses.

### POST /api/addresses
Create address.
```json
{ "userId": 3, "kind": "SHIPPING", "fullName": "Demo User", "line1": "123 St", "city": "City", "postalCode": "12345", "country": "US" }
```

### PUT /api/addresses/:id
Update address fields.

### DELETE /api/addresses/:id
Delete address.
