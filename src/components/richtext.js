import React from 'react'
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const Bold = ({ children }) => <b>{children}</b>;

const Text = ({ children }) => <p className="align-center">{children}</p>;

const richTextImages = {};

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
      // render the EMBEDDED_ASSET as you need
      const imageData = richTextImages[node.data.target.sys.id];
      const image = getImage(imageData.image)

      return (
        <div className="align-center">
          <GatsbyImage image={image} alt={imageData.alt}/>
        </div>
      );
    },
  },
};

class RichText extends React.Component {
    render() {

        this.props.content.content.references.map(reference => (
          richTextImages[reference.contentful_id] = {"image": reference.gatsbyImageData, "alt": reference.title}
        ))

        return (
            <div>
            { documentToReactComponents(JSON.parse(this.props.content.content.raw), options) }
            </div>
        )
    }
}

export default RichText
