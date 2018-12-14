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

class Room {
  constructor(directions, price, details, photo,  extra) {
    this.directions = {
      address: directions.address,
      coords: {
        lng: directions.lng,
        lat: directions.lat,
      },
    };

    this.price = {
      price: price.price,
      deposit: price.deposit,
    };

    this.info = {
      owner: details.owner,
      type: details.type,
      surface: details.surface,
      floor: details.floor,
      total: details.total,
      people: details.people,
    }

    this.details = {
      shower: details.shower,
      toilet: details.toilet,
      bath: details.bath,
      kitchen: details.kitchen,
      furniture: details.furniture,
      furniture_description: details.furn_description,
    }

    this.photo = photo;

    this.extra = extra;
  }
}

export {
  Student,
  Owner,
  Room,
};
