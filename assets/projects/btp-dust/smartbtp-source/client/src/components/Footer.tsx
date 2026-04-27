import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-orange-500 text-xl font-bold mb-4">SmartBTP Lyon</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Entreprise BTP spécialisée en gros œuvre, second œuvre et rénovation. Première entreprise française avec
              prix transparents et garantie satisfaction.
            </p>
            <p className="text-sm text-gray-400">
              <strong>SIRET :</strong> 123 456 789 00012
            </p>
            <p className="text-sm text-gray-400">
              <strong>Assurance :</strong> AXA Pro BTP
            </p>
          </div>

          <div>
            <h3 className="text-orange-500 text-xl font-bold mb-4">Contact & Urgences</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <strong>04 72 00 00 00</strong> (Bureau)
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <strong>06 12 34 56 78</strong> (Urgences)
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contact@smartbtp.fr
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                15 rue des Artisans, 69001 Lyon
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Lun-Ven 8h-18h, Sam 9h-12h
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-orange-500 text-xl font-bold mb-4">Nos Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Gros œuvre (850€/m²)</li>
              <li>Second œuvre (650€/m²)</li>
              <li>Rénovation complète (1200€/m²)</li>
              <li>Extension maison (1600€/m²)</li>
              <li>Dépannage & urgences</li>
              <li>Devis gratuits sous 24h</li>
            </ul>
          </div>

          <div>
            <h3 className="text-orange-500 text-xl font-bold mb-4">Zone d'intervention</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Lyon et métropole</li>
              <li>• Villeurbanne</li>
              <li>• Caluire-et-Cuire</li>
              <li>• Rhône (69)</li>
              <li>• Ain (01) - sur devis</li>
              <li>• Isère (38) - sur devis</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; 2024 SmartBTP Lyon. Tous droits réservés. |{" "}
            <a href="#" className="text-orange-500 hover:underline">
              Mentions légales
            </a>{" "}
            |{" "}
            <a href="#" className="text-orange-500 hover:underline">
              Politique de confidentialité
            </a>{" "}
            |{" "}
            <a href="#" className="text-orange-500 hover:underline">
              CGV
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
