import Link from 'next/link';

const Footer: React.FC = () => (
  <footer className="flex items-center h-16 text-white bg-neutral-800">
    <div className="flex justify-between content ">
      <p>
        Made with &#10084;&#65039; by{' '}
        <Link href="https://znagy.hu/">
          <a target="_blank" className="font-bold hover:underline">
            stay
          </a>
        </Link>{' '}
        from <b>Hungary</b>.
      </p>
      <Link href="https://github.com/stay-js/todo">
        <a target="_blank" className="font-bold hover:underline">
          GitHub
        </a>
      </Link>
    </div>
  </footer>
);

export default Footer;
