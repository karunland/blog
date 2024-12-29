import { Row, Col } from 'react-bootstrap';
import { BlogList } from '../components/blogList';
import { Categories } from '../components/Categories';

export function Home() {
  return (
    <Row>
      <Col md={3}>
        <Categories />
      </Col>
      <Col md={9}>
        <BlogList />
      </Col>
    </Row>
  );
}
