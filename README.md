# Project Overview

## Project Name: "Buy U"
***URL TBD***

## Project Description
Database of products used to identify which are made with union labor.

### API 

Unsure. Most likely using one (or a combination) of the following:

- upcdatabase.org
- barcodelookup.com
- CSV file of Union-made products provided by the AFL-CIO

### MVP/PostMVP

#### MVP 

- Build database with either real or dummy product data 
- Create controllers/routers to allow full CRUD functionality 

#### PostMVP  

- Split authorization between users (Read-Only) and administraters (full CRUD)
- Build models for union & company databases
- Build out a GUI

### Goals 
Tuesday, Feb 21 - Get proposal approved. Research data & build model.
Wednesday, Feb 22 - Build database, controllers, routers etc. (MVP)
Thursday, Feb 23 - Build a bare bones front-end (post-MVP) 
Friday, Feb 24 - Explore data authorization to set up users & admins with split CRUD functionality 
Monday, Feb 27 - Improve front-end etc.
Tuesday, Feb 28 - Presentation

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
