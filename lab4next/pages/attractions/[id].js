import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import noImage from '../images/no-image.jpeg';
import Layout from '../components/MyLayout';
import styles from '../styles/layout.module.css';
import '../styles/globals.css';

const Attraction = ({ attraction }) => {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>{attraction.name}</h1>
          <Image
            src={attraction.images ? attraction.images[0].url : noImage}
            alt="Attraction Image"
            width={250}
            height={250}
          />

          <dl>
          <p>
              <dt className="title">Type:</dt>
              {attraction.type ? (
                <dd>{attraction.type}</dd>
              ) : (
                <dd>Not Available</dd>
              )}
            </p>
            <p>
              <dt className="title">Classifications:</dt>
              {attraction.classifications &&
              attraction.classifications.segment ? (
                <dd>{attraction.classifications.segment.name}</dd>
              ) : (
                <dd>Not Available</dd>
              )}
            </p>
            <p>
              <dt className="title">Genre:</dt>
              {attraction.classifications &&
              attraction.classifications.genre ? (
                <dd>{attraction.classifications.genre.name}</dd>
              ) : (
                <dd>Not Available</dd>
              )}
            </p>
            <p>
              <dt className="title">SubGenre:</dt>
              {attraction.classifications &&
              attraction.classifications.subGenre ? (
                <dd>{attraction.classifications.subGenre.name}</dd>
              ) : (
                <dd>Not Available</dd>
              )}
            </p>
            <p>
              <dt className="title">YouTube:</dt>
              {attraction.externalLinks && attraction.externalLinks.youtube ? (
                <a href={attraction.externalLinks.youtube[0].url}>
                  {attraction.externalLinks.youtube[0].url}
                </a>
              ) : (
                <dd>Not Available</dd>
              )}
            </p>
            <p>
              <dt className="title">Twitter:</dt>
              {attraction.externalLinks && attraction.externalLinks.twitter ? (
                <a href={attraction.externalLinks.twitter[0].url}>
                  {attraction.externalLinks.twitter[0].url}
                </a>
              ) : (
                <dd>Not Available</dd>
              )}
            </p>
            <p>
              <dt className="title">Facebook:</dt>
              {attraction.externalLinks &&
              attraction.externalLinks.facebook ? (
                <a href={attraction.externalLinks.facebook[0].url}>
                  {attraction.externalLinks.facebook[0].url}
                </a>
              ) : (
                <dd>Not Available</dd>
              )}
            </p>
            <p>
              <dt className="title">Instagram:</dt>
              {attraction.externalLinks &&
              attraction.externalLinks.instagram ? (
                <a href={attraction.externalLinks.instagram[0].url}>
                  {attraction.externalLinks.instagram[0].url}
                </a>
              ) : (
                <dd>Not Available</dd>
              )}
            </p>
            <p>
            <dt className='title'>Homepage:</dt>
            {attraction.externalLinks &&attraction.externalLinks.homepage ? (
              <a href={attraction.externalLinks.homepage[0].url}>
              {attraction.externalLinks.homepage[0].url}
              </a>
              ) : (
              <dd>Not Available</dd>
              )}
            </p>
            <p>
              <dt className="title">Upcoming Events:</dt>
              {attraction.upcomingEvents ? (
              <dd>{attraction.upcomingEvents._total}</dd>
              ) : (
              <dd>Not Available</dd>
              )}
            </p>
          </dl>
          <Link href="/attractions/page/1" legacyBehavior>
            <a>Back to First Page AttractionsList</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const { id } = params;
  const { data } = await axios.get(
  `https://app.ticketmaster.com/discovery/v2/attractions/${id}.json?countryCode=US&apikey=UhZkh6bYUIeOg1Ms9jGHBdHuX6kG5xmq`
  );
  
  return {
    props: {
      attraction: data
    },
    revalidate: 86400,
  };
}

export async function getStaticPaths() {
  const { data } = await axios.get(
    `https://app.ticketmaster.com/discovery/v2/attractions.json?countryCode=US&apikey=UhZkh6bYUIeOg1Ms9jGHBdHuX6kG5xmq`
  );
  const paths = data._embedded.attractions.map((attraction) => ({
    params: { id: attraction.id },
  }));

  return { paths, fallback: false };
}

export default Attraction;

