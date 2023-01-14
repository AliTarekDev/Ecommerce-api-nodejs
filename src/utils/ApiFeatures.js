
class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery= mongooseQuery;
        this.queryString= queryString;
    }

    paginate() {
        let page = this.queryString.page * 1 || 1;
        if (page < 0) page = 1;
        const size = 5;
        let skip = (page - 1) * size;
        this.mongooseQuery.skip(skip).limit(size);
        this.page= page;
        return this;
    }

    filter() {
        let queryString = { ...this.queryString };
        let excludedQuery = ["page", "keyword", "sort", "fields"];
        excludedQuery.forEach((ele) => {
          delete queryString[ele];
        });
      
        queryString = JSON.stringify(queryString);
        queryString = queryString.replace(
          /\b(gte|gt|lte|lt)\b/g,
          (match) => `$${match}`
        );
        queryString = JSON.parse(queryString);
        this.mongooseQuery.find(queryString);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery.sort(sortBy);
          }
          return this;
    }

    search() {
        if (this.queryString.keyword) {
            let keyword = this.queryString.keyword;
            this.mongooseQuery.find({
              $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
              ],
            });
          }

          return this
    }

    fields() {
        if(this.queryString.fields) {
            const fields= this.queryString.fields.split(',').join(' ');
            this.mongooseQuery.select(fields);
          }

          return this
    }
}

module.exports= ApiFeatures