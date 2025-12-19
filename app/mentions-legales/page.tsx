export default function MentionsLegales() {
  return (
    <main className="pt-32 pb-12 px-6 max-w-2xl mx-auto min-h-screen">
      <h1 className="font-serif text-3xl mb-8">Mentions Légales</h1>
      <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
        <p>Conformément aux dispositions de la loi n° 31-08 édictant des mesures de protection du consommateur.</p>
        
        <h2 className="font-serif text-xl text-black mt-6">1. Éditeur du site</h2>
        <p>
          Le site Hadilike.ma est édité par la société [NOM SOCIETE], SARL au capital de [MONTANT] DH.<br/>
          Siège social : [ADRESSE], Marrakech, Maroc.<br/>
          RC : [NUMERO] / ICE : [NUMERO]
        </p>

        <h2 className="font-serif text-xl text-black mt-6">2. Hébergement</h2>
        <p>Le site est hébergé par Vercel Inc.</p>

        <h2 className="font-serif text-xl text-black mt-6">3. Propriété intellectuelle</h2>
        <p>L'ensemble de ce site relève de la législation marocaine et internationale sur le droit d'auteur et la propriété intellectuelle.</p>
      </div>
    </main>
  );
}
