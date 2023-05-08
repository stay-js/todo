import Link from 'next/link';

export const Footer: React.FC = () => (
  <footer className="flex flex-col items-center justify-between bg-neutral-800 p-6 text-white md:flex-row">
    <p>
      Made with &#10084;&#65039; by{' '}
      <Link className="link font-bold" href="https://znagy.hu" target="_blank">
        stay
      </Link>{' '}
      from <b>Hungary</b>.
    </p>

    <div className="flex gap-2 md:gap-4">
      <Link className="link font-bold" href="https://github.com/stay-js/todo" target="_blank">
        GitHub
      </Link>

      <Link className="link font-bold" href="https://vercel.com" target="_blank">
        Vercel
      </Link>

      <Link className="link font-bold" href="https://planetscale.com" target="_blank">
        PlanetScale
      </Link>

      <Link className="link font-bold" href="https://upstash.com" target="_blank">
        Upstash
      </Link>
    </div>
  </footer>
);
