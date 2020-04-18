import {Link} from "../components/Link";

# Welcome

This series of posts is a guided tour of GRelDAL. Please go through the <Link href="#quick-start">Quick Start</Link> first if you haven't already.

After walking through the guides, you will develop a good operational familiarity with GRelDAL. These guides cover all important features of GRelDAL in reasonable detail. For more granular aspects you are encouraged to checkout the <Link href="api">API docs</Link> and the [source code](https://github.com/gammaql/greldal).

If you are looking for a quick solution to a problem you may checkout the <Link>FAQs</Link>.

## Sections

<h3><Link>Mapping Data Sources</Link></h3>

This briefly covers what a data source is, and how it relates to concepts in RDBMS and GraphQL. Going through this guide will enable you to understand how GRelDAL maps from database tables to GraphQL types and how this mapping can be configured for various use cases.

<Link href="mapping-data-sources">Read More...</Link>

<h3><Link>Mapping Operations</Link></h3>

Data sources are not useful in themselves. They are useful only if we can perform some operations on them. These operations enable us to query the database, save and update information and delete information we don't need.

This guide covers usage of operation presets which enable us to quickly setup CRUD operations and then delve deeper into custom operations which can contain complex business logic.

<Link href="mapping-operations">Read More...</Link>

<h3><Link>Mapping Associations</Link></h3>

Much of the power of relational databases comes from establishing constraints between databases and perform operations on multiple tables at ones using joins. This guide covers how we can take advantage of GRelDAL's powerful association mapping capabilities to take advantages of these features.

<Link href="mapping-associations">Read More...</Link>

<h3><Link>Best Practices</Link></h3>

This section contains some closing notes around best practices when developing data driven GraphQL APIs.

<Link href="best-practices">Read More...</Link>
