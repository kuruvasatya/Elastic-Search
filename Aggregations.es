# --------------------------------------------------------------------------------
# ecomerce data set
# --------------------------------------------------------------------------------
GET ecom/_mapping

PUT ecommerce_data
{
  "mappings": {
    "properties": {
      "Country": {
        "type": "keyword"
      },
      "CustomerID": {
        "type": "long"
      },
      "Description": {
        "type": "text"
      },
      "InvoiceDate": {
        "type": "date",
        "format": "M/d/yyyy H:m"
      },
      "InvoiceNo": {
        "type": "keyword"
      },
      "Quantity": {
        "type": "long"
      },
      "StockCode": {
        "type": "keyword"
      },
      "UnitPrice": {
        "type": "double"
      }
    }
  }
}


# reindexing to map customly
POST _reindex
{
  "source": {
    "index": "ecom"
  },
  "dest": {
    "index": "ecommerce_data"
  }
}

POST ecommerce_data/_delete_by_query
{
  "query":{
    "range":{
      "UnitPrice":{
        "lte":0
      }
    }
  }
}

POST ecommerce_data/_delete_by_query
{
  "query": {
    "range": {
      "UnitPrice": {
        "gte": 500
      }
    }
  }
}

GET ecommerce_data/_count
GET ecommerce_data/_mapping

GET ecommerce_data/_search

# group by country
GET ecommerce_data/_search
{
  "size": 0, 
  "aggs": {
    "Country_type": {
      "terms": {
        "field": "Country",
        "size": 100,
        "order": {
          "_count": "desc"
        }
      }
    }
  }
}

# Compute the sum of all unit prices in the index
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "Sum of all units": {
      "sum": {
        "field": "UnitPrice"
      }
    }
  }
}

# Compute the sum of unit prices of each country in the index
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "Group by Country": {
      "terms": {
        "field": "Country",
        "size": 100
      },
      "aggs": {
        "Sum of units": {
          "sum": {
            "field": "UnitPrice"
          }
        }
      }
    }
  }
}

# find the lowest unit price in index
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "Min Unit Price": {
      "min": {
        "field": "UnitPrice"
      }
    }
  }
}

# find the max unit price in index
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "Max Unit Price": {
      "max": {
        "field": "UnitPrice"
      }
    }
  }
}

# find the avg unit price in index
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "avg Unit Price": {
      "avg": {
        "field": "UnitPrice"
      }
    }
  }
}

# find the all stats of unit price in index
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "Stats of Unit Price": {
      "stats": {
        "field": "UnitPrice"
      }
    }
  }
}

# Cardinality aggregation
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "Unique Vlaues": {
      "cardinality": {
        "field": "Country"
      }
    }
  }
}

# bucket aggregation
# Date Histogram aggregation

# fixed interval 
GET ecommerce_data/_search
{
  "size": 0, 
  "aggs": {
    "time histogram": {
      "date_histogram": {
        "field": "InvoiceDate",
        "interval": "8h"
      }
    }
  }
}

# calendar interval histogram
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "year wise": {
      "date_histogram": {
        "field": "InvoiceDate",
        "interval": "month", 
        "order": {
          "_count": "desc"
        }
      }
    }
  }
}

# Histogram aggregation
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "transactions_per_price_interval": {
      "histogram": {
        "field": "UnitPrice",
        "interval": 10
      }
    }
  }
}


# Range Aggregations
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "transactions_per_custom_price_ranges": {
      "range": {
        "field": "UnitPrice",
        "ranges": [
          {
            "to": 50
          },
          {
            "from": 50,
            "to": 200
          },
          {
            "from": 200
          }
        ]
      }
    }
  }
}

# term aggregation
# find top 5 customers
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "Customers": {
      "terms": {
        "field": "CustomerID",
        "size": 5
      }
    }
  }
}

# **wanted to know the sum of revenue per day
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "Daily": {
      "date_histogram": {
        "field": "InvoiceDate",
        "interval": "day"
      },
      "aggs": {
        "Revenue Sum": {
          "sum": {
            "script": {
              "source": "doc['UnitPrice'].value * doc['Quantity'].value"
            }
          }
        }
      }
    }
  }
}


# **wanted to know the sum of revenue per day and no of uniques customers per day
GET ecommerce_data/_search
{
  "size": 0,
  "aggs": {
    "Daily": {
      "date_histogram": {
        "field": "InvoiceDate",
        "interval": "day",
        "order": {
          "Revenue Sum": "desc"
        }
      },
      "aggs": {
        "Revenue Sum": {
          "sum": {
            "script": {
              "source": "doc['UnitPrice'].value * doc['Quantity'].value"
            }
          }
        },
        "Unique Customers": {
          "cardinality": {
            "field": "CustomerID"
          }
        }
      }
    }
  }
}
