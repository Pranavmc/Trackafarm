import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  ShoppingCart,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  PackageOpen,
  Sparkles,
  Tractor,
  ShieldCheck,
  SlidersHorizontal,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api from '../../lib/api';
import './Marketplace.css';

const CATEGORIES = ['Agriculture', 'Animal Husbandry', 'Farm Equipment', 'Fertilizers', 'Seeds'];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getStockMeta = (countInStock) => {
  if (countInStock > 50) {
    return { label: 'Ready to Ship', className: 'is-strong' };
  }

  if (countInStock > 0) {
    return { label: 'Limited Stock', className: 'is-medium' };
  }

  return { label: 'Out of Stock', className: 'is-low' };
};

const RatingStars = ({ rating }) => (
  <div className="marketplace-rating" aria-label={`Rated ${rating || 0} out of 5`}>
    {Array.from({ length: 5 }).map((_, index) => {
      const isActive = index < Math.floor(rating || 0);
      return (
        <Star
          key={index}
          size={14}
          className={isActive ? 'marketplace-rating__star is-active' : 'marketplace-rating__star'}
        />
      );
    })}
  </div>
);

const StatCard = ({ icon, label, value, accent }) => (
  <article className={`marketplace-stat-card ${accent}`}>
    <div className="marketplace-stat-card__icon">{icon}</div>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  </article>
);

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState({});

  const deferredKeyword = useDeferredValue(keyword.trim());
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products', {
          params: { keyword: deferredKeyword, category, pageNumber: page },
        });
        setProducts(data.products);
        setPages(data.pages);
        setPage(data.page);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [deferredKeyword, category, page]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.qty, 0),
    [cartItems]
  );

  const featuredBrands = useMemo(() => {
    const brands = products
      .map((product) => product.brand)
      .filter(Boolean)
      .filter((brand, index, arr) => arr.indexOf(brand) === index);

    return brands.slice(0, 4);
  }, [products]);

  const marketplaceStats = useMemo(() => {
    const inStock = products.filter((product) => product.countInStock > 0).length;
    const featured = products.filter((product) => (product.rating || 0) >= 4).length;
    const averagePrice =
      products.length > 0
        ? products.reduce((sum, product) => sum + (product.price || 0), 0) / products.length
        : 0;

    return {
      inStock,
      featured,
      averagePrice,
    };
  }, [products]);

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setPage(1);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItems((prev) => ({ ...prev, [product._id]: true }));

    window.setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product._id]: false }));
    }, 1800);
  };

  return (
    <div className="marketplace-page">
      <section className="marketplace-hero">
        <div className="marketplace-hero__backdrop" />
        <div className="marketplace-hero__content">
          <div className="marketplace-hero__copy">
            <div className="marketplace-pill">
              <Sparkles size={14} />
              Curated Agri Commerce
            </div>

            <h1>
              A marketplace built for
              <span> modern farm operators.</span>
            </h1>

            <p>
              Discover premium supplies, equipment, and livestock essentials in a storefront
              designed to feel elegant, fast, and unmistakably next-generation.
            </p>

            <div className="marketplace-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products, brands, or tools..."
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="marketplace-stats">
              <StatCard
                icon={<Tractor size={18} />}
                label="Live listings"
                value={loading ? '...' : `${products.length}+`}
                accent="accent-cyan"
              />
              <StatCard
                icon={<ShieldCheck size={18} />}
                label="Top rated"
                value={loading ? '...' : `${marketplaceStats.featured}`}
                accent="accent-pink"
              />
              <StatCard
                icon={<Sparkles size={18} />}
                label="Avg. basket"
                value={loading ? '...' : formatCurrency(marketplaceStats.averagePrice)}
                accent="accent-violet"
              />
            </div>
          </div>

          <aside className="marketplace-showcase glass-card">
            <div className="marketplace-showcase__eyebrow">Marketplace preview</div>
            <div className="marketplace-showcase__panel">
              <div>
                <span>In-stock products</span>
                <strong>{loading ? '...' : marketplaceStats.inStock}</strong>
              </div>
              <div>
                <span>Cart activity</span>
                <strong>{cartCount}</strong>
              </div>
            </div>

            <div className="marketplace-showcase__feature">
              <p>Why this feels better</p>
              <ul>
                <li>Cleaner luxury layout</li>
                <li>Stronger product imagery</li>
                <li>Motion with restraint</li>
              </ul>
            </div>

            <button className="marketplace-cart-fab" onClick={() => navigate('/dashboard/cart')}>
              <ShoppingCart size={18} />
              <span>Open cart</span>
              {cartCount > 0 && <em>{cartCount}</em>}
            </button>
          </aside>
        </div>
      </section>

      <section className="marketplace-shell">
        <aside className="marketplace-sidebar glass-card">
          <div className="marketplace-sidebar__header">
            <div>
              <p>Refine catalog</p>
              <h2>Browse with precision</h2>
            </div>
            <SlidersHorizontal size={18} />
          </div>

          <div className="marketplace-filter-group">
            <span className="marketplace-filter-group__label">Categories</span>
            <div className="marketplace-category-list">
              <button
                type="button"
                className={!category ? 'is-active' : ''}
                onClick={() => handleCategoryChange('')}
              >
                All collections
              </button>
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={category === item ? 'is-active' : ''}
                  onClick={() => handleCategoryChange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="marketplace-filter-group">
            <span className="marketplace-filter-group__label">Featured brands</span>
            <div className="marketplace-brand-cloud">
              {(featuredBrands.length > 0 ? featuredBrands : ['AgriPro', 'GreenEarth', 'NutriBull']).map(
                (brand) => (
                  <span key={brand}>{brand}</span>
                )
              )}
            </div>
          </div>

          <div className="marketplace-filter-note">
            <strong>Current focus</strong>
            <p>
              {category || 'All categories'}{deferredKeyword ? ` matched with "${deferredKeyword}"` : ''}
            </p>
          </div>
        </aside>

        <div className="marketplace-results">
          <div className="marketplace-results__header">
            <div>
              <p className="marketplace-results__eyebrow">Product gallery</p>
              <h2>{loading ? 'Loading collection...' : `${products.length} products ready to explore`}</h2>
            </div>

            <div className="marketplace-results__meta">
              <span>{category || 'All categories'}</span>
              <button type="button" onClick={() => navigate('/dashboard/cart')}>
                Cart <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="marketplace-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="marketplace-skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="marketplace-empty glass-card">
              <PackageOpen size={54} />
              <h3>No products matched this search</h3>
              <p>Try broadening the category or using a simpler keyword.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setKeyword('');
                  setCategory('');
                  setPage(1);
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="marketplace-grid">
                {products.map((product, index) => {
                  const stockMeta = getStockMeta(product.countInStock);
                  const isAdded = addedItems[product._id];

                  return (
                    <article
                      key={product._id}
                      className="marketplace-product-card"
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <div className="marketplace-product-card__media">
                        <img src={product.image} alt={product.name} />
                        <div className={`marketplace-stock-badge ${stockMeta.className}`}>
                          {stockMeta.label}
                        </div>
                        <button
                          type="button"
                          className={`marketplace-product-card__cta ${isAdded ? 'is-added' : ''}`}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.countInStock === 0}
                        >
                          {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                        </button>
                      </div>

                      <div className="marketplace-product-card__body">
                        <div className="marketplace-product-card__meta">
                          <span>{product.subcategory || product.category}</span>
                          <small>{product.brand}</small>
                        </div>

                        <h3>{product.name}</h3>
                        <p>{product.description}</p>

                        <div className="marketplace-product-card__rating-row">
                          <RatingStars rating={product.rating} />
                          <small>{product.numReviews || 0} reviews</small>
                        </div>

                        <div className="marketplace-product-card__footer">
                          <div>
                            <span>Price</span>
                            <strong>{formatCurrency(product.price)}</strong>
                          </div>
                          <button
                            type="button"
                            className="marketplace-link-button"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.countInStock === 0}
                          >
                            {product.countInStock === 0 ? 'Unavailable' : 'Add to cart'}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {pages > 1 && (
                <nav className="marketplace-pagination" aria-label="Marketplace pages">
                  <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: pages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={page === pageNumber ? 'is-active' : ''}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
                    disabled={page === pages}
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
