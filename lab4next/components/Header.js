import Link from 'next/link';

const linkStyle = {
  marginRight: 15,
};

const Header = () => (
  <div>
    <Link href='/'>
      <a style={linkStyle}>Home</a>
    </Link>

    <Link href='/events/page/1'>
      <a style={linkStyle}>Events</a>
    </Link>

    <Link href='/attractions/page/1'>
      <a style={linkStyle}>Attractions</a>
    </Link>

    <Link href='/venues/page/1'>
      <a style={linkStyle}>Venues</a>
    </Link>
  </div>
);

export default Header;

