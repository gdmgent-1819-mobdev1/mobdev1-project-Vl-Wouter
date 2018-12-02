class User {
  constructor(id, email, fname, lname, address, postcode, city, phone) {
    this.id = id;
    this.email = email;
    this.first_name = fname;
    this.last_name = lname;
    this.address = address;
    this.postcode = postcode;
    this.city = city;
    this.phone = phone;
  }
}

class Student extends User {
  constructor(id, email, fname, lname, address, postcode, city, phone, type, school) {
    super(id, email, fname, lname, address, postcode, city, phone);
    this.type = type;
    this.school = school;
  }
}

class Owner extends User {
  constructor(id, email, fname, lname, address, postcode, city, phone, type) {
    super(id, email, fname, lname, address, postcode, city, phone);
    this.type = type;
  }
}

export {
  Student,
  Owner,
};
