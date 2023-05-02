import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import noImage from '@images/no-image.jpeg';
import Layout from '../../components/MyLayout';
import styles from '../../styles/layout.module.css';
import '../../styles/globals.css';

const Venue = ({ venue }) => {
  const regex = /(<([^>]+)>)/gi;

  let boxOfficeInfo = null;
  if (venue && venue.boxOfficeInfo && venue.boxOfficeInfo.openHoursDetail) {
    boxOfficeInfo = venue.boxOfficeInfo.openHoursDetail.replace(regex, '');
  } else {
    boxOfficeInfo = 'No box office info available';
  }

  let generalInfo = null;
  if (venue && venue.generalInfo && venue.generalInfo.generalRule) {
    generalInfo = venue.generalInfo.generalRule.replace(regex, '');
  } else {
    generalInfo = 'No general info available';
  }

  let parkingDetail = null;
  if (venue && venue.parkingDetail) {
    parkingDetail = venue.parkingDetail.replace(regex, '');
  } else {
    parkingDetail = 'No parking info available';
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>{venue.name}</h1>
          <Image
            src={venue.images ? venue.images[0].url : noImage}
            alt="Venue Image"
            width={250}
            height={250}
          />
          <dl>
            <p>
            <dt className="title">Time Zone:</dt>
            {venue.timeZone ? (
              <dd>{venue.timeZone}</dd>
            ) : (
              <dd>'Not Available'</dd>
            )}
            </p>
            <p>
              <dt className='title'>Address:</dt>
              {venue.address && venue.address.line1 ? (
              <dd>
                {venue.address.line1}, {venue.city && venue.city.name ? venue.city.name : 'Unknown City'}
                {venue.state && venue.state.name ? ', ' + venue.state.name : ''},{' '}
                {venue.country && venue.country.name ? venue.country.name : 'Unknown Country'}{' '}
                {venue.postalCode ? venue.postalCode : ''}
              </dd>
              ) : (
                <dd>Not Available</dd>
              )}
            </p>
            <p>
            <dt className='title'>boxOfficeInfo:</dt>
            <dd>{boxOfficeInfo}</dd>
            </p>
            <p>
            <dt className='title'>generalInfo:</dt>
            <dd>{generalInfo}</dd>
            </p>
            <p>
            <dt className='title'>parkingDetail:</dt>
            <dd>{parkingDetail}</dd>
            </p>
          </dl>
          <Link href="/venues/page/1" legacyBehavior>
            <a>Back to First Page VenuesList</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const { id } = params;
  const { data } = await axios.get(
    `https://app.ticketmaster.com/discovery/v2/venues/${id}.json?countryCode=US&apikey=UhZkh6bYUIeOg1Ms9jGHBdHuX6kG5xmq`
  );

  return {
    props: {
      venue: data
    },
    revalidate: 86400,
  };
}

export async function getStaticPaths() {
  const { data } = await axios.get(
    'https://app.ticketmaster.com/discovery/v2/venues.json?&countryCode=US&apikey=UhZkh6bYUIeOg1Ms9jGHBdHuX6kG5xmq'
  );

  const paths = data._embedded.venues.map((venue) => ({
    params: { id: venue.id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default Venue;

