# Project Overview

## Project Name: "Buy U"
***URL TBD***

## Project Description
Database of products used to identify which are made with union labor.

## API 

## API Snippet

### MVP/PostMVP

#### MVP 

- Build database with either real or dummy product data 
- Create controllers/routers to allow full CRUD functionality 

#### PostMVP  

- Split authorization between users (Read-Only) and administraters (full CRUD)
- Build models for union & company databases
- Build out a GUI

### Goals 
What you plan to accomplish for each day of the project week.

## Data Model

```js
const productSchema = new mongoose.Schema {
  UPC: Number,
  productName: String,
  manufacturer: String,
  isUnion: Boolean,
  unionName: String,
  lastUpdated: Date
}
```
