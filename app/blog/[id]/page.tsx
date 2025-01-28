"use client";
import React from "react";
import { useParams } from "next/navigation";
import HeaderBlogDetail from "./head";
function BlogDetail() {
  const params = useParams<{ id: string }>();
  console.log(params);
  return (
    <>
      <HeaderBlogDetail
        bgUrl={
          "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
        }
        title={"Your Light Is About To Stop Being Relevant"}
      />
      <section className="mx-auto w-[1280px] ">
        <div id="blog__content" className="mt-20">
          <p className="text-base leading-relaxed">
            The European languages are members of the same family. Their
            separate existence is a myth. For science, music, sport, etc, Europe
            uses the same{" "}
            <a
              href="https://themeger.shop/html/katen/html/blog-single.html#"
              rel="noopener noreferrer"
              target="_blank"
              className="text-pink-500"
            >
              vocabulary
            </a>
            . The languages only differ in their grammar, their pronunciation
            and their most common words.
          </p>
          <p className="text-base leading-relaxed">
            Everyone realizes why a new common language would be desirable: one
            could refuse to pay expensive translators. To achieve this, it would
            be necessary to have uniform grammar, pronunciation and more common
            words.
          </p>
          <p className="text-center">
            <img
              src="https://themeger.shop/wordpress/katen/wp-content/uploads/2022/08/kaizen-nguy-n-1066357-unsplash-1024x683.jpg"
              className="h-auto w-full"
              alt="A caption for the above image"
            />
          </p>
          <p className="text-base leading-relaxed">
            The languages only differ in their grammar, their pronunciation and
            their most common words. Everyone realizes why a new common language
            would be desirable.
          </p>
          <p className="text-center">
            <img
              src="https://themeger.shop/wordpress/katen/wp-content/uploads/2022/08/single-sm-1.jpg"
              className="h-auto w-full max-w-sm"
              alt=""
            />
          </p>
          <p className="text-base leading-relaxed">
            One could refuse to pay expensive translators. To achieve this, it
            would be necessary to have uniform grammar, pronunciation and more
            common words.
          </p>
          <p className="text-base leading-relaxed">
            If several languages coalesce, the grammar of the resulting language
            is more simple and regular than that of the individual languages.
            The new common language will be more simple and regular than the
            existing{" "}
            <a
              href="https://themeger.shop/html/katen/html/blog-single.html#"
              rel="noopener noreferrer"
              target="_blank"
              className="text-pink-500"
            >
              European languages
            </a>
            . It will be as simple as Occidental; in fact, it will be
            Occidental.
          </p>
          <p className="text-base leading-relaxed">
            A collection of textile samples lay spread out on the table – Samsa
            was a travelling salesman – and above it there hung a picture that
            he had recently cut out of an illustrated magazine and housed in a
            nice, gilded frame.
          </p>
          <h3 className="text-xl font-semibold">
            Pityful a rethoric question ran over her cheek
          </h3>
          <p className="text-base leading-relaxed">
            Even the all-powerful Pointing has no control about the blind texts
            it is an almost unorthographic life One day however a small line of
            blind text by the name of Lorem Ipsum decided to leave for the far
            World of Grammar.
          </p>
          <p className="text-base leading-relaxed">
            The Big Oxmox advised her not to do so, because there were thousands
            of bad Commas, wild Question Marks and devious Semikoli, but the
            Little Blind Text didn’t listen. She packed her seven versalia, put
            her initial into the belt and made herself on the way.
          </p>
          <p className="text-base leading-relaxed">
            I am so happy, my dear friend, so absorbed in the{" "}
            <em className="font-semibold">exquisite sense</em> of mere tranquil
            existence, that I neglect my talents. I should be incapable of
            drawing a single stroke at the present moment; and yet I feel that I
            never was a greater artist than now.
          </p>
          <p className="text-center">
            <img
              src="https://themeger.shop/wordpress/katen/wp-content/uploads/2022/08/post-md-10.jpg"
              className="h-auto w-full"
              alt=""
            />
            <img
              src="https://themeger.shop/wordpress/katen/wp-content/uploads/2022/08/post-lg-1.jpg"
              className="h-auto w-full"
              alt=""
            />
          </p>
          <h3 className="text-xl font-semibold">Conclusion</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li className="text-base leading-relaxed">
              How about if I sleep a little bit
            </li>
            <li className="text-base leading-relaxed">
              A collection of textile samples lay spread out
            </li>
            <li className="text-base leading-relaxed">
              His many legs, pitifully thin compared with
            </li>
            <li className="text-base leading-relaxed">
              He lay on his armour-like back
            </li>
            <li className="text-base leading-relaxed">
              Gregor Samsa woke from troubled dreams
            </li>
          </ul>
          <p className="text-base leading-relaxed">
            To an English person, it will seem like simplified{" "}
            <a
              href="https://themeger.shop/html/katen/html/blog-single.html#"
              rel="noopener noreferrer"
              target="_blank"
              className="text-pink-500"
            >
              English
            </a>
            , as a skeptical Cambridge friend of mine told me what Occidental
            is. The European languages are members of the same family. Their
            separate existence is a myth. For science, music, sport, etc, Europe
            uses the same vocabulary.
          </p>
        </div>
      </section>
    </>
  );
}
export default BlogDetail;
