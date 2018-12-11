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
  constructor(prijs, waarborg, type, opp, verdieping, personen, toilet, douche, bad, keuken, meubels, beschrijvingMeubels, foto, adres, postcode, gemeente, coords, totaal, opmerking, kotbaas) {
    this.prijs = prijs;
    this.waarborg = waarborg;
    this.type = type;
    this.opp = opp;
    this.verdieping = verdieping;
    this.personen = personen;
    this.toilet = toilet;
    this.douche = douche;
    this.bad = bad;
    this.meubels = meubels;
    this.beschrijving_meubels = beschrijvingMeubels;
    this.foto = foto;
    this.adres = adres;
    this.postcode = postcode;
    this.gemeente = gemeente;
    this.coords = coords;
    this.totaal = totaal;
    this.opmerking = opmerking;
    this.kotbaas = kotbaas;
  }
}

export {
  Student,
  Owner,
  Room,
};
