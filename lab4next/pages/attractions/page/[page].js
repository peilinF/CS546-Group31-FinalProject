// pages/attractions/page/[page].js
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import noImage from '@images/no-image.jpeg';
import Layout from '@/components/MyLayout';
import styles from '@/styles/layout.module.css';
import '@/styles/globals.css';

const AttractionsList = ({ attractionsData, page }) => {
  const totalPages = 50;

  const buildCard = (attraction) => {
    const { name, images, classifications, url } = attraction;
    const imageSrc = images && images[0] ? images[0].url : noImage;

    return (
      <div className={styles.card} key={attraction.id}>
        <Link href={`/attractions/${attraction.id}`}>
          <a>
            <Image src={imageSrc} alt="attraction image" width={250} height={250} />
            <h3>{name}</h3>
          </a>
        </Link>
        <p>{classifications[0]?.genre?.name || 'No genre available'}</p>
        <p>{url || 'No url available'}</p>
      </div>
    );
  };

  const card = attractionsData && attractionsData.map((attraction) => buildCard(attraction));

  return (
    <Layout>
      <div className={styles.container}>
        {card}
        <div className={styles.pagination}>
          {page > 1 && (
            <Link href={`/attractions/page/${Number(page) - 1}`} legacyBehavior>
              <a>Prev</a>
            </Link>
          )}
          {'  '}
          {page < totalPages && (
            <Link href={`/attractions/page/${Number(page) + 1}`} legacyBehavior>
              <a>Next</a>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/attractions.json?page=${Number(params.page) - 1}&apikey=UhZkh6bYUIeOg1Ms9jGHBdHuX6kG5xmq&countryCode=US`);
  return {
    props: {
      attractionsData: data._embedded.attractions,
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

export default AttractionsList;
