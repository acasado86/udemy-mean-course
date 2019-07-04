import { AuthService } from './../../auth/auth.service';
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
  isLoading = false;
  private postsSub: Subscription;
  totalPosts = 100;
  postsPerPage = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25];
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(private postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostsUpdateListener()
      .subscribe(
        (postData: {posts: Post[], postsCount: number}) => {
          this.posts = postData.posts;
          this.totalPosts = postData.postsCount;
        }
    );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

}
