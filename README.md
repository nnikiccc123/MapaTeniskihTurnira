Ova veb aplikacija omogućava lako pronalaženje i vizuelizaciju teniskih turnira na mapi. 
Korisnici mogu filtrirati turnire po lokaciji, datumu i drugim kriterijumima, čime se pojednostavljuje planiranje i učešće na turnirima.

Korišćene tehnologije:

1. Prikupljanje podataka o turnirima
  JavaScript, Node.js, Puppeteer – Skrepovanje podataka sa različitih veb sajtova i generisanje baze turnira.
2️. Veb aplikacija za prikaz turnira
  React, TypeScript – Razvoj korisničkog interfejsa.
  OpenLayers – Vizuelizacija turnira na interaktivnoj mapi.

Projekat je organizovan u dva foldera unutar direktorijuma packages: datafetch i maps

datafetch – odgovoran za prikupljanje podataka o teniskim turnirima.
Pokretanjem CollectData.js i postavljanjem godina (npr. yearFrom = 2026, yearTo = 2026), podaci o turnirima za te godine će biti preuzeti i sačuvani u direktorijumu data.
Trenutno su dostupni turniri za od 2010. do 2025. godinu, ali moguće je preuzeti podatke za sledeće godine kad god postanu dostupni, samo treba pokrenuti CollectData.js sa odgovarajućim parametrima.


Pokretanje: git clone https://github.com/nnikiccc123/MapaTeniskihTurnira.git
            cd maps
            npm install
            npm start

