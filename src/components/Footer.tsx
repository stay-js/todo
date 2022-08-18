import Link from 'next/link';

const Footer: React.FC = () => (
  <footer className="flex flex-col items-center justify-between bg-neutral-800 p-6 text-white md:flex-row">
    <p>
      Made with &#10084;&#65039; by{' '}
      <Link href="https://znagy.hu/">
        <a target="_blank" className="link font-bold">
          stay
        </a>
      </Link>{' '}
      from <b>Hungary</b>.
    </p>

    <div className="flex gap-2 md:gap-4">
      <Link href="https://github.com/stay-js/todo">
        <a target="_blank" className="link font-bold">
          GitHub
        </a>
      </Link>

      <Link href="https://vercel.com/">
        <a target="_blank" className="link font-bold">
          Vercel
        </a>
      </Link>

      <Link href="https://planetscale.com/">
        <a target="_blank" className="link font-bold">
          PlanetScale
        </a>
      </Link>
    </div>
  </footer>
);

export default Footer;
