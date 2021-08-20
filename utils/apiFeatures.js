class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filtering
  filter() {
    const { ...this.queryString, page, sort, limit, fields } = req.query;

    let queryStr = JSON.stringify(...this.queryString);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // Limiting Fields
  limitFields() {
    if(this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
    } else {
        this.query = this.query.select('-__v')
    }

    return this;
  }

  // Paginate
  paginate() {
    const pageNum = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (pageNum - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    
    return this;
  }
}

module.exports = APIFeatures;
