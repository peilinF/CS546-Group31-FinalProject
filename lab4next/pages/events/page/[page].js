import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import noImage from '@images/no-image.jpeg';
import Layout from '../../components/MyLayout';
import styles from '../../components/layout.module.css';
import '../globals.css';

const EventsList = ({ showsData, page }) => {
  const totalPages = 50;

  const buildCard = (event) => {
    const { name, images, dates, priceRanges } = event;
    const startDate = dates.start && dates.start.localDate ? `Start date: ${dates.start.localDate}` : 'Start date not available';
    const startDateTime = dates.start && dates.start.localTime ? `Start time: ${dates.start.localTime}` : 'Start time not available';
    const imageSrc = images && images[0] ? images[0].url : noImage;
    const priceRange =
      priceRanges && priceRanges[0]
        ? `Price: ${priceRanges[0].min} - ${priceRanges[0].max}`
        : 'Price not available';

    return (
      <div className={styles.card} key={event.id}>
        <Link href={`/events/${event.id}`}>
          <a>
            <Image src={imageSrc} alt="event image" width={250} height={250} />
            <h3>{name}</h3>
          </a>
        </Link>
        <p>{startDate}</p>
        <p>{startDateTime}</p>
        <p>{priceRange}</p>
      </div>
    );
  };

  const card = showsData && showsData.map((event) => buildCard(event));

  return (
    <Layout>
      <div className={styles.container}>
        {card}
        <div className={styles.pagination}>
          {page > 1 && (
            <Link href={`/events/page/${Number(page) - 1}`} legacyBehavior>
              <a>Prev</a>
            </Link>
          )}
          {'  '}
          {page < totalPages && (
            <Link href={`/events/page/${Number(page) + 1}`} legacyBehavior>
              <a>Next</a>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?&page=${Number(params.page) - 1}&apikey=UhZkh6bYUIeOg1Ms9jGHBdHuX6kG5xmq&countryCode=US`);
  return {
    props: {
      showsData: data._embedded.events,
      page: Number(params.page),
    },
    revalidate: 86400,
  };
}

export async function getStaticPaths() {
  const totalPages = 50;
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default EventsList;

