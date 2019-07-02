import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from './../post.model';
import { PostsService } from './../posts.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: `This is the first post's content` },
  //   { title: 'Second Post', content: `This is the second post's content` },
  //   { title: 'Third Post', content: `This is the third post's content` },
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;
  totalPosts = 100;
  postsPerPage = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25];

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostsUpdateListener()
      .subscribe(
        (postData: {posts: Post[], postsCount: number}) => {
          this.posts = postData.posts;
          this.totalPosts = postData.postsCount;
        }
      );
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

}
