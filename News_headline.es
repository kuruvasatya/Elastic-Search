# news heaedlines dataset
# --------------------------------------------------------------------------------------
GET news_headlines/_search
GET news_headlines/_count
GET news_headlines/_mapping

# news between two specific date, sorted by datem, and want count
GET news_headlines/_search
{
  "size": 100, 
  "query": {
    "range": {
      "date": {
        "gte": "2017-02-01",
        "lte": "2018-01-01"
      }
    }
  },
  "sort": [
    {
      "date": {
        "order": "asc"
      }
    }
  ], 
  "aggs": {
    "count": {
      "value_count": {
        "field": "date"
      }
    }
  }
}

# need differnet categories and count of news for each category
GET news_headlines/_search
{
  "size": 0, 
  "aggs": {
    "Category": {
      "terms": {
        "field": "category",
        "size": 100, 
        "order": {
          "_term": "asc"
        }
      }
    }
  }
}


# Get all the Entertainment headlines and find the popular topic among them
GET news_headlines/_search
{
  "_source": ["headline"],
  "size": 200,
  "query": {
    "match": {
      "category": "ENTERTAINMENT"
    }
  },
  "aggs": {
    "Popular In Entertainment": {
      "significant_text": {
        "field": "headline"
      }
    }
  }
}

# match uses OR logic so the recall will be high and precision will be low
GET news_headlines/_search
{
  "query": {
    "match": {
      "headline": {
        "query": "Khloe Kardashian Kendall Jenner"
      }
    }
  }
}

# trying to imporove precision
GET news_headlines/_search
{
  "query": {
    "match": {
      "headline": {
        "query": "Khloe Kardashian Kendall Jenner",
        "minimum_should_match": 3
      }
    }
  }
}
