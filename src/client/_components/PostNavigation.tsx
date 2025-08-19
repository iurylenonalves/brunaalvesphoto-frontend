'use client';

import Link from 'next/link';
import styles from '../../styles/post-navigation.module.css';

interface NavPost {
  slug: string;
  title: string;
}

interface PostNavigationProps {
  previousPost: NavPost | null;
  nextPost: NavPost | null;
  locale: string;
}

export default function PostNavigation({ previousPost, nextPost, locale }: PostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }
  
  const basePath = `/${locale}/blog`;

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navLinkWrapper}>
        {previousPost && (
          <Link href={`${basePath}/${previousPost.slug}`} className={styles.navLink}>
            <span className={styles.navLabel}>Previous Post</span>
            <span className={styles.navTitle}>{previousPost.title}</span>
          </Link>
        )}
      </div>
      <div className={`${styles.navLinkWrapper} ${styles.alignRight}`}>
        {nextPost && (
          <Link href={`${basePath}/${nextPost.slug}`} className={styles.navLink}>
            <span className={styles.navLabel}>Next Post</span>
            <span className={styles.navTitle}>{nextPost.title}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}