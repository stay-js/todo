import Link from 'next/link';

const Footer: React.FC = () => (
  <footer className="flex flex-col md:flex-row items-center justify-between p-6 text-white bg-neutral-800">
    <p>
      Made with &#10084;&#65039; by{' '}
      <Link href="https://znagy.hu/">
        <a target="_blank" className="font-bold link">
          stay
        </a>
      </Link>{' '}
      from <b>Hungary</b>.
    </p>

    <div className="flex gap-2 md:gap-4">
      <Link href="https://github.com/stay-js/todo">
        <a target="_blank" className="font-bold link">
          GitHub
        </a>
      </Link>

      <Link href="https://vercel.com/">
        <a target="_blank" className="font-bold link">
          Vercel
        </a>
      </Link>

      <Link href="https://planetscale.com/">
        <a target="_blank" className="font-bold link">
          PlanetScale
        </a>
      </Link>
    </div>
  </footer>
);

export default Footer;
